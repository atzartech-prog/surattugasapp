#!/usr/bin/env bash

# Script untuk menjalankan local server di Termux untuk Aplikasi Surat Tugas
# Lokasi Aplikasi: /data/data/com.termux/files/home/surat-tugas-app

PORT=8080
DIR="/data/data/com.termux/files/home/surat-tugas-app"

echo "============================================="
echo "   Aplikasi Surat Tugas & Laporan Kegiatan   "
echo "============================================="
echo "Mencari runtime server yang tersedia..."

# Cek Python 3
if command -v python3 >/dev/null 2>&1; then
    echo "[✓] Menggunakan Python 3 Web Server"
    echo "Silakan buka tautan berikut di browser HP Anda:"
    echo "👉 http://localhost:$PORT"
    echo "---------------------------------------------"
    echo "Tekan CTRL+C untuk menghentikan server."
    python3 -m http.server $PORT --directory "$DIR"

# Cek Python 2
elif command -v python >/dev/null 2>&1; then
    echo "[✓] Menggunakan Python Web Server"
    echo "Silakan buka tautan berikut di browser HP Anda:"
    echo "👉 http://localhost:$PORT"
    echo "---------------------------------------------"
    echo "Tekan CTRL+C untuk menghentikan server."
    cd "$DIR" && python -m SimpleHTTPServer $PORT

# Cek Node.js (npx http-server)
elif command -v node >/dev/null 2>&1; then
    echo "[✓] Menggunakan Node.js via npx http-server"
    echo "Silakan buka tautan berikut di browser HP Anda:"
    echo "👉 http://localhost:$PORT"
    echo "---------------------------------------------"
    echo "Tekan CTRL+C untuk menghentikan server."
    npx -y http-server "$DIR" -p $PORT

# Cek PHP
elif command -v php >/dev/null 2>&1; then
    echo "[✓] Menggunakan PHP Web Server"
    echo "Silakan buka tautan berikut di browser HP Anda:"
    echo "👉 http://localhost:$PORT"
    echo "---------------------------------------------"
    echo "Tekan CTRL+C untuk menghentikan server."
    cd "$DIR" && php -S localhost:$PORT

else
    echo "[✗] Tidak ditemukan runtime server (Python, Node, PHP)."
    echo "Tenang, Anda tetap bisa membuka aplikasi langsung:"
    echo "1. Buka File Manager di HP Anda."
    echo "2. Cari folder internal storage: SuratTugasApp"
    echo "3. Klik file 'index.html' dan buka menggunakan browser pilihan Anda (Chrome/Firefox/Kiwi)."
    echo "---------------------------------------------"
fi
