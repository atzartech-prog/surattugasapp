# 📝 Aplikasi Surat Tugas & Laporan Kegiatan (TugasKu)

Aplikasi berbasis web sederhana namun premium untuk mengelola data **Surat Tugas**, mencatat **Laporan Deskripsi Kegiatan**, dan mengekspor rekapitulasi bulanan ke format cetak atau PDF yang siap dibagikan.

Aplikasi ini berjalan sepenuhnya di sisi klien (Client-side) dan menggunakan **LocalStorage** peramban sebagai database lokal sehingga tidak memerlukan instalasi server database eksternal.

---

## ✨ Fitur Utama

- **Dashboard Statistik**: Memantau jumlah total surat tugas, tugas aktif, dan tugas selesai secara real-time.
- **Manajemen Surat Tugas (CRUD)**:
  - Input Nomor Surat Tugas resmi.
  - Judul / Perihal penugasan.
  - Informasi Pemberi Tugas (PIC) & Jabatan.
  - Informasi Penerima Tugas (Pelaksana) & NIP/ID.
  - Tanggal Pembuatan Surat & Periode Pelaksanaan (Tanggal Mulai s.d Selesai).
  - Penentuan status tugas (Aktif / Selesai).
- **Uraian Laporan Kegiatan Dinamis**: Form pembuatan surat tugas dilengkapi dengan penambahan baris aktivitas laporan kegiatan secara dinamis dan interaktif.
- **Pratinjau Kertas Resmi**:
  - Halaman pratinjau dokumen individual menggunakan layout Kop Surat resmi instansi pemerintahan, kolom tanda tangan (Signature block), dan tabel deskripsi kegiatan.
- **Cetak Laporan Bulanan**:
  - Menyusun seluruh daftar tugas dalam satu bulan ke dalam tabel rekapitulasi terpadu untuk ditandatangani.
  - Mendukung cetak langsung ke printer fisik atau simpan sebagai berkas **PDF** (menggunakan dialog cetak browser).
- **Backup & Restore**:
  - **Ekspor**: Mengunduh seluruh data dalam format `.json` untuk dicadangkan di penyimpanan HP.
  - **Impor**: Memulihkan database lama dengan mengunggah file `.json` cadangan.
  - **Hapus Semua**: Opsi pembersihan database lokal.

---

## 🛠️ Teknologi yang Digunakan

1. **HTML5**: Struktur halaman semantik.
2. **CSS3 (Vanilla)**: Tampilan antarmuka modern bernuansa gelap (slate/indigo theme), transisi interaktif, dan stylesheet khusus cetak (`@media print`).
3. **Vanilla JS**: Logika CRUD, interaksi DOM, penyimpanan lokal, impor/ekspor file cadangan, serta filter data.
4. **Font & Icon**: Google Fonts (Plus Jakarta Sans) & FontAwesome Icons.

---

## 📂 Struktur Direktori

* **`/data/data/com.termux/files/home/surat-tugas-app/`**: Folder instalasi utama di dalam Termux.
* **`/sdcard/SuratTugasApp/`** (Termux path: `~/storage/shared/SuratTugasApp`): Folder sinkronisasi khusus di penyimpanan internal HP Android. Anda dapat membuka aplikasi secara langsung di browser HP tanpa Termux dengan membuka file `index.html` di dalam folder ini.

---

## 🚀 Cara Menjalankan Aplikasi di HP

### Metode A: Menggunakan Local Server Termux (Direkomendasikan)
Metode ini paling direkomendasikan karena mencegah batasan keamanan browser pada protokol file (`file://`).

1. Buka aplikasi **Termux**.
2. Masuk ke folder aplikasi:
   ```bash
   cd ~/surat-tugas-app
   ```
3. Jalankan skrip launcher:
   ```bash
   ./start.sh
   ```
4. Server lokal akan aktif pada port **8080**. Buka browser di HP Anda lalu buka alamat berikut:
   👉 **`http://localhost:8080`**

### Metode B: Tanpa Termux (Melalui File Manager)
1. Buka **File Manager** bawaan HP Android Anda.
2. Cari penyimpanan internal, lalu buka folder **`SuratTugasApp`**.
3. Ketuk berkas **`index.html`** dan pilih buka menggunakan browser (seperti Google Chrome atau Firefox).

---

## 🖨️ Panduan Menyimpan Dokumen ke PDF
1. Pada pratinjau dokumen surat tugas atau laporan bulanan, klik tombol **Cetak / PDF**.
2. Pada setelan printer yang muncul di browser HP, ubah pilihan printer menjadi **Simpan sebagai PDF (Save as PDF)**.
3. Atur ukuran kertas ke **A4** dan orientasi **Potret (Portrait)**.
4. Klik tombol simpan untuk mengunduh berkas PDF yang siap dibagikan ke WhatsApp, Email, atau platform komunikasi lainnya.
