const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("baileys");
const pino = require("pino");
const cron = require("node-cron");
const cors = require("cors");
const moment = require("moment-timezone");
const QRCode = require("qrcode");
const qrcodeTerminal = require("qrcode-terminal");
const path = require("path");

const app = express();
const port = 3000;

// Configs
app.use(express.json());
app.use(cors()); // Simplified CORS middleware

let sock;
let currentQrCode = "";
let connectionStatus = "DISCONNECTED";

// Setup SQLite database
const db = new sqlite3.Database("./schedule.db", (err) => {
  if (err) console.error(err.message);
  console.log("Connected to SQLite database");
});

db.run(`CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT,
    message TEXT,
    scheduleTime TEXT
)`);

// Baileys Connection Logic
async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("baileys_auth");
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    auth: state,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      currentQrCode = await QRCode.toDataURL(qr);
      connectionStatus = "WAITING_FOR_SCAN";
      console.log("QR Code generated. Scan to connect:");
      qrcodeTerminal.generate(qr, { small: true });
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect.error?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log("Connection closed. Reconnecting...", shouldReconnect);
      connectionStatus = "DISCONNECTED";
      if (shouldReconnect) connectToWhatsApp();
    } else if (connection === "open") {
      console.log("WhatsApp client is ready!");
      currentQrCode = "";
      connectionStatus = "CONNECTED";
    }
  });

  sock.ev.on("creds.update", saveCreds);
}

connectToWhatsApp();

// API Endpoints
app.get("/api/status", (req, res) => {
  res.json({ status: connectionStatus });
});

app.get("/api/qr", (req, res) => {
  if (currentQrCode) {
    res.json({ qrCodeUrl: currentQrCode });
  } else {
    res.json({ message: "WhatsApp is already connected or initializing", status: connectionStatus });
  }
});

app.post("/api/schedule", (req, res) => {
  const { phone, message, scheduleTime } = req.body;

  // Simple sanitation (remove '+' or leading '0' could be added here)
  const formattedPhone = phone.replace(/[^0-9]/g, "");

  db.run(
    `INSERT INTO schedules (phone, message, scheduleTime) VALUES (?, ?, ?)`,
    [formattedPhone, message, scheduleTime],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Error saving schedule" });
      }
      res.json({ message: "Schedule saved successfully", id: this.lastID });
    }
  );
});

// Cron job to send messages
cron.schedule("* * * * *", () => {
  const now = moment().tz("Asia/Jakarta").format("YYYY-MM-DDTHH:mm");

  db.all(
    `SELECT * FROM schedules WHERE scheduleTime <= ?`,
    [now],
    async (err, rows) => {
      if (err) {
        console.error("Error fetching schedules:", err);
        return;
      }

      for (const row of rows) {
        if (connectionStatus === "CONNECTED" && sock) {
          try {
            const remoteJid = `${row.phone}@s.whatsapp.net`;
            await sock.sendMessage(remoteJid, { text: row.message });

            db.run(`DELETE FROM schedules WHERE id = ?`, [row.id]);
            console.log(`[Success] Message sent to ${row.phone}`);
          } catch (error) {
            console.error(`[Failed] Error sending to ${row.phone}:`, error);
          }
        } else {
          console.warn(`[Delayed] Client not connected, skipping schedule ID: ${row.id}`);
        }
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
