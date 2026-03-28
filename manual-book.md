# WaSche - WhatsApp Scheduler Professional Manual Book

Dokumentasi lengkap mengenai instalasi, konfigurasi, dan penggunaan sistem penjadwalan pesan WhatsApp berbasis Node.js.

## 1. Nama Project
**WaSche (WhatsApp Scheduler)**

## 2. Deskripsi Lengkap
WaSche adalah solusi otomatisasi berbasis Node.js yang dirancang untuk menangani penjadwalan pesan WhatsApp secara efisien. Proyek ini dibangun di atas library **Baileys**, sebuah library socket WhatsApp yang modern dan ringan. Berbeda dengan sistem berbasis Puppeteer/Selenium, WaSche tidak memerlukan browser headless, menjadikannya pilihan ideal untuk dijalankan di server dengan sumber daya terbatas (low-end VPS).

## 3. Tujuan Project / Problem yang Diselesaikan
Proyek ini hadir untuk menyelesaikan masalah interaksi manual yang memakan waktu, seperti:
- Pengiriman pengingat (reminders) di waktu tertentu secara presisi.
- Pengiriman pesan berkala tanpa harus standby di depan layar.
- Mengurangi ketergantungan pada browser yang memakan RAM besar dalam proses otomatisasi WA.

## 4. Daftar Fitur
- **Browserless Connection**: Menggunakan socket langsung via Baileys.
- **Persistent Session**: Sesi login disimpan secara lokal (multi-file auth).
- **Scheduled Queue**: Database SQLite untuk antrean pesan yang aman.
- **Cron Engine**: Eksekusi pengiriman setiap menit dengan presisi tinggi.
- **API Ready**: Dilengkapi dengan REST API untuk integrasi pihak ketiga.
- **Auto-Reconnection**: Sistem otomatis mencoba terhubung kembali jika koneksi terputus.

## 5. Table of Contents
1. [Panduan Instalasi Detail](#6-panduan-instalasi-detail)
2. [Konfigurasi](#7-konfigurasi)
3. [Quick Start](#8-quick-start)
4. [Panduan Penggunaan Lengkap](#9-panduan-penggunaan-lengkap)
5. [Contoh Penggunaan](#10-contoh-penggunaan)
6. [Struktur Folder](#11-struktur-folderproject)
7. [Arsitektur Sistem](#12-penjelasan-arsitektur-sistem)
8. [Dokumentasi API](#13-api-documentation)
9. [Troubleshooting & FAQ](#16-troubleshooting)

## 6. Panduan Instalasi Detail
### Persiapan Lingkungan
1. Install **Node.js** versi 16 atau lebih tinggi.
2. Install **Git** (Opsional).
3. Pastikan port `3000` tersedia di mesin Anda.

### Langkah Instalasi
1. Clone atau download folder project ini.
2. Buka terminal di direktori project.
3. Jalankan `npm install` untuk mengunduh semua library yang diperlukan:
   - `@whiskeysockets/baileys` (via `baileys`)
   - `express`
   - `sqlite3`
   - `node-cron`
   - `pino`
   - `qrcode`

## 7. Konfigurasi
Aplikasi ini dirancang untuk berjalan dengan konfigurasi minimal.
- **Port**: Default pada `3000`. Dapat diubah di `server.js`.
- **Auth Path**: File sesi disimpan di folder `./baileys_auth`.
- **Database**: Database SQLite disimpan di `./schedule.db`.
- **TimeZone**: Secara default diset ke `Asia/Jakarta`.

## 8. Quick Start
1. Jalankan server: `npm run dev`.
2. Scan QR Code yang muncul di terminal menggunakan WhatsApp (Linked Devices).
3. Buka browser: `http://localhost:3000`.
4. Masukkan jadwal pesan pertama Anda.

## 9. Panduan Penggunaan Lengkap
### Tahapan Penjadwalan
1. Masukkan **Nomor WhatsApp** tujuan dengan format internasional (tanpa tanda '+', contoh: `62812...`).
2. Tuliskan **Pesan** yang ingin dikirimkan.
3. Pilih **Waktu Kirim** (Tahun, Bulan, Hari, Jam, Menit).
4. Klik **Kirim Jadwal**. Pesan akan disimpan di antrean database.
5. Cron job akan memeriksa antrean setiap 60 detik.

## 10. Contoh Penggunaan
- **Kasus**: Mengirim ucapan ulang tahun tepat pukul 00:00.
- **Nomor**: `628xxxxx`
- **Pesan**: "Selamat Ulang Tahun! Semoga panjang umur."
- **Waktu**: `2024-12-31 00:00`

## 11. Struktur Folder/Project
```text
/WaSche
├── baileys_auth/    # Penyimpanan sesi WhatsApp (Rahasia)
├── node_modules/    # Library dependensi
├── index.html       # Antarmuka web sederhana (Frontend)
├── server.js        # Logika utama (Backend & Scheduler)
├── schedule.db      # Database antrean pesan
├── package.json     # Konfigurasi dependensi & metadata
└── README.md        # Ringkasan informasi project
```

## 12. Penjelasan Arsitektur Sistem
Sistem berjalan menggunakan model **Event-Driven**:
1. **Express Server**: Menerima request dari user untuk memasukkan data ke SQLite.
2. **Baileys Socket**: Menjaga koneksi tetap aktif dengan server WhatsApp.
3. **SQLite**: Menyimpan antrean pesan secara persisten agar tidak hilang saat server mati.
4. **Node-Cron**: Sebagai "jantung" yang memicu pengecekan database setiap menit untuk mengirim pesan yang sudah jatuh tempo.

## 13. API Documentation
### GET `/api/status`
Cek status koneksi WhatsApp (CONNECTED/WAITING/DISCONNECTED).
### GET `/api/qr`
Mengambil data QR Code terbaru dalam format Base64 Image.
### POST `/api/schedule`
Menambahkan jadwal baru.
- Body: `{ "phone": "string", "message": "string", "scheduleTime": "YYYY-MM-DDTHH:mm" }`

## 14. CLI Commands
- `npm start`: Menjalankan server secara normal.
- `npm run dev`: Menjalankan server menggunakan `node server.js`.

## 15. Testing
1. Cek koneksi dengan perintah `npm start`.
2. Pastikan file `schedule.db` terbuat otomatis.
3. Gunakan Postman atau browser untuk mengetes endpoint API.

## 16. Troubleshooting
- **QR Tidak Muncul**: Pastikan koneksi internet stabil dan port 3000 tidak diblokir.
- **Pesan Tidak Terkirim**: Cek apakah nomor menggunakan format internasional tanpa simbol (hanya angka).
- **Error SQLite**: Hapus file `schedule.db` dan jalankan ulang aplikasi jika database korup.

## 17. FAQ
- **Apakah HP harus selalu online?** Ya, WhatsApp (Linked Devices) membutuhkan HP utama sesekali untuk sinkronisasi, meski sistem ini bisa berjalan tanpa browser.
- **Bisa kirim gambar?** Versi saat ini difokuskan pada pengiriman teks. Dukungan media akan hadir di update mendatang.

## 18. Best Practices Penggunaan
- Gunakan nomor WhatsApp yang sudah "berumur" (aging) untuk menghindari banned dari pihak WhatsApp.
- Jangan mengirim pesan massal (spam) dalam waktu singkat secara brutal.
- Lakukan backup folder `baileys_auth` agar tidak perlu scan ulang jika pindah server.

## 19. Contributing Guide
Kontribusi sangat terbuka! Silakan lakukan:
1. Fork repository ini.
2. Buat branch fitur baru (`git checkout -b feature/new-logic`).
3. Commit perubahan Anda.
4. Lakukan Pull Request.

## 20. Coding Standards
- Gunakan nama variabel yang deskriptif.
- Selalu bungkus proses asinkron (Baileys) dalam blok `try...catch`.
- Berikan komentar pada logika yang kompleks.

## 21. Roadmap / Rencana Pengembangan
- [ ] Dashboard UI yang lebih modern.
- [ ] Support pengiriman File & Gambar.
- [ ] Penjadwalan pesan berulang (Repeatable Schedules).
- [ ] Integrasi Webhook untuk pesan masuk.

## 22. Changelog
- **v1.0.0**: Inisialisasi project, migrasi ke Baileys, integrasi SQLite & Cron.

## 23. License
Project ini dilisensikan di bawah **MIT License**.

## 24. Author / Credits
Dikembangkan dengan ❤️ oleh **Dhamar Putra** di bawah naungan **Fujiwara Creative**.
