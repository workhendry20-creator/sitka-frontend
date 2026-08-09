# SITKA Project Overview

## Deskripsi Proyek
**SITKA (Sistem Informasi Tumbuh Kembang & Akademik Anak)** adalah platform manajemen pendidikan PAUD/TK modern yang menghubungkan secara lansung 3 *Role* utama: **Guru (Pendidik)**, **Orang Tua (Parent)**, dan **Administrator**. Platform ini menyediakan pelacakan perkembangan anak secara *real-time* berbasis standar **SDIDTK / Buku KIA** dan analisis cerdas **Naive Bayes**, yang sepenuhnya terintegrasi dengan basis data cloud Supabase.

---

## Arsitektur & Teknologi

* **Frontend Framework**: React 19 (dibangun menggunakan Vite untuk performa tinggi & waktu muat instan).
* **Styling**: Vanilla Tailwind CSS (v4) terintegrasi dengan PostCSS untuk desain antarmuka yang responsif, modern, dan berestetika tinggi.
* **Routing & Navigasi**: React Router DOM (v7) dengan gerbang otorisasi *Protected Route* sesuai peran (*Role-Based Access*).
* **Visualisasi Data**: Recharts (BarChart, PieChart, RadarChart, LineChart) dengan label persentase melayang (`LabelList`) dan *high-contrast* Tooltips.
* **Backend & Database**: **Supabase (Backend-as-a-Service)** via `@supabase/supabase-js` untuk otentikasi, penyimpanan data terpusat, dan REST API.
* **Integrasi Real-Time**: Sistem penyiaran event lokal (*Custom Event Dispatchers*) `sitka_harian_updated` & `sitka_semester_updated` untuk pembaruan grafik tanpa reload browser.
* **Continuous Integration & Deployment (CI/CD)**: GitHub Repo `workhendry20-creator/sitka-frontend.git` terhubung langsung dengan **Vercel Live Auto-Deployment**.

---

## Skema & Arsitektur Database Supabase

Seluruh tampilan dan visualisasi grafik di ketiga role **100% konsisten dan tersinkronisasi murni dari tabel Supabase** (tanpa data dummy/hardcoded):

1. **`users`**: Menyimpan kredensial login dan profil akun (`id`, `nama`, `role` ['admin'|'guru'|'ortu'], `nip`, `nisn`, `password`, `token`, `nama_anak`, `kelompok`).
2. **`siswa`**: Data induk 26 anak didik (`id`, `nama`, `rombel`, `tanggal_lahir`, `jk`, `nisn`, `nik`, `agama`, `alamat_lengkap`, `nama_ayah`, `nama_ibu`, `bb`, `tb`, `lingkar_kepala`, `no_wa`).
3. **`nilai_harian`**: Catatan anekdot harian, presensi (`Hadir`, `Izin`, `Sakit`, `Alpa`), dan emosi mood anak (`Bahagia 😊`, `Aktif ⚡`, `Fokus 🎯`, `Ceria 🌟`, `Tenang 😐`, `Istimewa 🌟`).
4. **`nilai_semester`**: Evaluasi rapor semester per anak (`semester: '1 (Ganjil)'` dan `'2 (Genap)'`), rekomendasi guru, serta objek JSONB `skor_indikator` (`nam_*`, `mot_*`, `kog_*`, `bah_*`, `se_*`).
5. **`pengumuman`**: Informasi & broadcast kegiatan sekolah yang tersambung *live* ke beranda Guru dan Ortu.
6. **`v_siswa_evaluasi`**: SQL View untuk pemetaan siswa lengkap dengan perhitungan usia dinamis.

---

## Fitur Utama Berdasarkan Peran (Role-Based Access)

### 1. 🧑‍🏫 Guru (Teacher)
- **Dashboard Guru Realtime**:
  - **BarChart 4 Domain Kelas**: Menghitung rata-rata ketercapaian 4 domain perkembangan (*Gerak Kasar*, *Gerak Halus*, *Bicara & Bahasa*, *Sosial & Kemandirian*) dari Supabase `nilai_semester`.
  - **PieChart Kategori Perkembangan**: Distribusi otomatis siswa (*Sesuai Usia*, *Mulai Berkembang*, *Perlu Intervensi*).
  - **BarChart Mood & Anekdot**: Statistik kondisi emosional harian anak dari Supabase `nilai_harian`.
  - **Stat Card Kehadiran**: Rerata persentase kehadiran riil kelas.
- **Input Nilai & Presensi**:
  - **Input Nilai Harian & Anekdot**: Menyimpan status kondisi dan catatan anekdot langsung ke Supabase `nilai_harian`.
  - **Input Nilai Semester**: Evaluasi rapor berbasis indikator SDIDTK dan rekomendasi Naive Bayes AI ke Supabase `nilai_semester`.
  - **Presensi Kelas**: Manajemen absensi harian per rombel (A / B) dengan sinkronisasi otomatis.
- **Big Data Report Guru**:
  - **Overview Grafik & Analitik Individual**: Single Radar Chart, Single BarChart Capaian, serta **Comparative Overlay Radar & BarChart (Semester 1 Ganjil vs Semester 2 Genap)** yang memunculkan nilai $\Delta$ kenaikan perkembangan.
  - **Timeline Anekdot & Progress KIA**: Monitoring catatan harian dan survei mingguan orang tua.

### 2. 👨‍👩‍👧 Orang Tua (Parent)
- **Dashboard Ortu dengan Visualisasi Live**:
  - **Header Badge Dinamis**: Menampilkan nama & usia siswa dinamis dari database (`👶 Nama Siswa • Usia X Thn (Y Bln)`).
  - **BarChart 4 Emoji Anekdot Harian**: Menampilkan frekuensi kondisi emosional anak yang diberikan Guru di Supabase `nilai_harian`.
  - **BarChart Capaian Semester**: Menampilkan persentase capaian 4 domain semester anak secara presisi dari Supabase `nilai_semester`.
  - **PieChart Kehadiran Bulanan**: Kalkulasi otomatis jumlah hari `Hadir`, `Izin`, `Sakit`, `Alpa`.
- **Kuesioner SDIDTK & Dokumen KIA**:
  - Navigasi **2-View** (*Category Menu* -> *Detail Accordion*) dengan logika penguncian usia (*Age Lock Logic*).
  - Unggah foto/video dokumentasi kegiatan anak dan catatan momen unik.

### 3. 🛡️ Admin (System Administrator)
- **Dashboard Overview Sistem**: Menampilkan jumlah total pendidik aktif (`users` role `guru`) dan total anak didik (`siswa`) secara *real-time*.
- **Manajemen User (CRUD)**: Kontrol penuh akun pengguna (Admin, Guru, Orang Tua) beserta pembuatan password & token.
- **Kurikulum & Ekspor Data**: Filter rombel dan ekspor data siswa ke format CSV.
- **Manajemen Perkembangan**: Menghitung persentase rata-rata perkembangan fisik, kognitif, dan sosial emosional per anak dan kelas dari Supabase `nilai_semester`.

---

## Pembaruan & Integrasi Terakhir

1. **Sinkronisasi Total Data Supabase**: Menghapus seluruh data acak/dummy. Mengisi database dengan **182 entri harian variatif** (7 tanggal berbeda) dan **52 entri rapor semester** untuk seluruh 26 siswa via skrip SQL [`seed_data.sql`](file:///Users/mm/SITKA-PROJECT/sitka-frontend/seed_data.sql).
2. **Penyelarasan Grafik 4 Domain & Capaian Semester**: Single Radar Chart dan Single BarChart Capaian Semester sepenuhnya dikalkulasi dari objek `skor_indikator` di Supabase.
3. **Komparasi Adaptif 2 Semester**: Mode 2 Semester membandingkan secara langsung nilai `sem1DomainScores` (Ganjil) dan `sem2DomainScores` (Genap) dari Supabase, serta menghitung `delta` (kenaikan perkembangan) tanpa wajib menunggu semester genap.
4. **Visual Contrast & Recharts Tooltips**:
   - Menambahkan `itemStyle` putih terang (`#ffffff`) dan `labelStyle` amber (`#fbbf24`) pada Tooltip berlatar navy `#0a1e36`.
   - Menambahkan `<LabelList>` persentase di atas puncang batang BarChart agar angka terbaca dengan jelas.
5. **Live Vercel Auto-Deployment**: Terhubung langsung dengan repositori GitHub [`workhendry20-creator/sitka-frontend.git`](https://github.com/workhendry20-creator/sitka-frontend.git) branch `main`.

---

## Instruksi Penggunaan (Server Lokal)

Untuk menjalankan aplikasi di lingkungan pengembangan lokal:
```bash
# 1. Masuk ke direktori frontend
cd sitka-frontend

# 2. Install dependensi proyek
npm install

# 3. Jalankan server lokal Vite
npm run dev

# 4. Buka di browser: http://localhost:5173
```
