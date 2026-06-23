# 📝 Aplikasi Surat Tugas & Laporan Kegiatan (TugasKu)

Aplikasi berbasis web sederhana namun premium untuk mengelola data **Surat Tugas**, mencatat **Laporan Hasil Kegiatan** dengan editor kaya teks (Rich-Text), dan mengekspor rekapitulasi bulanan ke format cetak atau PDF yang siap dibagikan.

Aplikasi ini berjalan sepenuhnya di sisi klien (Client-side) dan menggunakan **LocalStorage** peramban sebagai database lokal sehingga tidak memerlukan instalasi server database eksternal.

---

## ✨ Fitur Utama yang Diperbarui

- **Pemberian Nomor Otomatis**:
  - Input manual Nomor Surat Tugas dihapus.
  - Nomor surat dihitung secara otomatis berdasarkan bulan dan tahun tugas, dengan format resmi: `[No. Urut]/ST/[Bulan Romawi]/[Tahun]` (contoh: `1/ST/VI/2026`).
- **Pelaksana Tugas Multi & Peran Berbeda**:
  - Mendukung input banyak pelaksana tugas untuk setiap satu surat tugas.
  - Setiap pelaksana memiliki kolom **Nama**, **Peran/Jabatan** yang berbeda, serta **NIP/ID** masing-masing.
- **Fitur Salin Pelaksana**:
  - Tombol **Salin dari ST Lain** untuk menduplikasi daftar pelaksana dari surat tugas yang telah dibuat sebelumnya untuk menghemat waktu pengetikan.
- **Rich-Text Editor untuk Laporan**:
  - Uraian kegiatan diinput melalui editor kaya teks (WYSIWYG sederhana) yang mendukung pemformatan:
    - **Tebal (Bold)**, *Miring (Italic)*, <u>Garis Bawah (Underline)</u>.
    - Judul/Header (H1 & H2).
    - Daftar Bulatan (Unordered List) & Daftar Angka (Ordered List).
- **Tata Letak Cetak Teroptimasi (PDF/Kertas)**:
  - **Pratinjau Surat Tugas**: Uraian kegiatan diletakkan pada seksi khusus di bawah detail surat sehingga teks panjang tidak merusak tata letak cetak.
  - **Rekap Bulanan**: Kolom laporan dilepas dari kolom tabel samping dan diletakkan pada **baris penuh (colspan) khusus** tepat di bawah baris metadata surat tugas, memastikan berkas PDF tetap rapi dan mudah dibaca.
- **Backup & Restore**:
  - Ekspor/Unduh basis data ke file `.json`.
  - Impor/Pulihkan basis data dari file `.json` lama.

---

## 🛠️ Teknologi yang Digunakan

1. **HTML5**: Struktur halaman semantik.
2. **CSS3 (Vanilla)**: Tampilan antarmuka modern bernuansa gelap (slate/indigo theme), transisi interaktif, dan stylesheet khusus cetak (`@media print`).
3. **Vanilla JS**: Logika CRUD, interaksi DOM, penyimpanan lokal, generator nomor otomatis, editor teks kaya berbasis `contenteditable`, serta penanganan ekspor/impor data.
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
