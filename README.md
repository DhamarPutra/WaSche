# WaSche (WhatsApp Scheduler)

A lightweight, reliable, and browserless WhatsApp scheduled messaging system built with Node.js.

## Deskripsi Singkat
**WaSche** adalah aplikasi berbasis Node.js yang memungkinkan pengguna untuk menjadwalkan pengiriman pesan WhatsApp secara otomatis. Menggunakan library **Baileys** (Socket-based), aplikasi ini sangat efisien karena tidak memerlukan browser Headless (Puppeteer), sehingga hemat RAM dan stabil untuk dijalankan di server atau VPS.

## Cara Install / Setup
1. **Clone repository ini:**
   ```bash
   git clone <repository-url>
   cd WaSche
   ```
2. **Instal dependensi:**
   ```bash
   npm install
   ```
3. **Persiapkan Database:**
   Aplikasi akan otomatis membuat file `schedule.db` (SQLite) saat pertama kali dijalankan.

## Cara Penggunaan
1. **Jalankan aplikasi:**
   ```bash
   npm run dev
   ```
2. **Hubungkan WhatsApp:**
   Buka terminal, scan QR Code yang muncul menggunakan fitur "Perangkat Tertaut" di aplikasi WhatsApp Anda.
3. **Jadwalkan Pesan:**
   Buka browser di `http://localhost:3000` (atau gunakan API POST ke `/api/schedule`) untuk memasukkan nomor tujuan, isi pesan, dan waktu pengiriman.

## Dependencies / Requirements
- **Node.js** (v16+)
- **Baileys**: Koneksi socket WhatsApp.
- **Express**: REST API server.
- **SQLite3**: Penyimpanan data jadwal pesan.
- **Node-Cron**: Penjadwal eksekusi otomatis.
- **Moment-Timezone**: Manajemen zona waktu (Asia/Jakarta).

## License
Project ini dilisensikan di bawah **MIT License**. Lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.

---
Developed by **Dhamar Putra (Fujiwara Creative)**