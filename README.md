# Digit 4 – News Portal

**Proyek Ujian Tengah Semester (UTS) Pemrograman Web | [NIM LENGKAP ANDA]**

| Nama | [NAMA LENGKAP ANDA] |
| :--- | :--- |
| NIM | **[NIM LENGKAP ANDA]** |
| Repository GitHub | **[LINK REPOSITORY GITHUB ANDA]** |

---

## 1. Deskripsi & Tujuan Proyek

Aplikasi portal berita interaktif yang dibangun menggunakan **ReactJS (Vite)** dan di-*host* di **Vercel**.

Proyek ini bertujuan untuk mendemonstrasikan penguasaan konsep React modern, *state management* tingkat lanjut (Context + Reducer), dan praktik desain web profesional, sekaligus memenuhi seluruh kriteria CPMK yang dipersyaratkan.

**Sumber Data API:** [NewsAPI](https://newsapi.org/)

---

## 2. Deployment

Aplikasi sudah di-*deploy* dan dapat diakses melalui link berikut:

**Link Deployment Vercel:** [LINK VERCEL ANDA DI SINI]

---

## 3. Fitur Utama & Panduan Penggunaan

### A. Fitur Navigasi & Tampilan

* **Navigasi Kategori Cepat:** Gunakan *link* di *header* (Business, Technology, Sports, dll.) untuk filter cepat yang otomatis me-*reset* semua filter pencarian.
* **Theming (*Dark Mode*):** Klik ikon bulan/matahari di pojok kanan atas. *Setting* tema disimpan secara persisten di *browser* menggunakan **Custom Hook** (`useLocalStorage`).

### B. Fitur Advanced Search (Sesuai Kriteria Form)

Fitur pencarian diakses dengan mengklik ikon kaca pembesar di *header*.

* **Pencarian Kata Kunci:** Input utama untuk mencari topik.
* **Sort By:** Filter urutan hasil (Latest, Relevance, Popularity).
* **Filter Tanggal (*Date Picker*):** Filter *exact date* menggunakan komponen React Date Picker.
* **Filter Bahasa & Judul:** Opsi pencarian spesifik berdasarkan bahasa (ID/EN) atau hanya di judul artikel (**Minimal 5 Input Berbeda terpenuhi**).

### C. Fitur Data & Layout

* **Pagination:** Tombol "Previous" dan "Next" di bagian bawah halaman untuk menavigasi hasil pencarian yang banyak.
* **Layout Responsif:** Desain diimplementasikan menggunakan **Flexbox** dan **CSS Grid**, dan dioptimasi penuh untuk perangkat **Mobile & Desktop** menggunakan *media queries*.

---

## 4. Screenshot Detail Aplikasi

Untuk memenuhi kriteria dokumentasi yang detail, berikut tampilan dari berbagai fitur:

### A. Homepage (Desktop View)
*Tampilan utama dengan navigasi kategori dan *sidebar*.*
[Tambahkan tag gambar, contoh: ![Screenshot Homepage](path/to/your/screenshot_homepage.jpg)]

### B. Advanced Search Form
*Tampilan *pop-up* form pencarian yang canggih dengan semua filter terlihat.*
[Tambahkan tag gambar, contoh: ![Screenshot Search Form](path/to/your/screenshot_search_form.jpg)]

### C. Mobile View (Responsif)
*Tampilan responsif saat diakses dari perangkat *mobile*.*
[Tambahkan tag gambar, contoh: ![Screenshot Mobile View](path/to/your/screenshot_mobile.jpg)]

### D. Dark Mode
*Tampilan aplikasi dalam mode gelap.*
[Tambahkan tag gambar, contoh: ![Screenshot Dark Mode](path/to/your/screenshot_darkmode.jpg)]

---

## 5. Panduan Instalasi (Lokal)

### A. Persiapan API Key

Proyek ini membutuhkan API Key dari NewsAPI. Karena faktor keamanan, API Key Anda harus disimpan di file lokal.

1.  Daftar dan dapatkan **API Key Gratis** Anda dari [https://newsapi.org/].
2.  Di folder utama proyek, salin file template:
    ```bash
    cp .env.example .env
    ```
3.  Buka file `.env` yang baru, dan ganti *placeholder* dengan API Key Anda:
    ```
    VITE_NEWS_API_KEY=YOUR_ACTUAL_NEWSAPI_KEY_HERE
    ```

### B. Menjalankan Aplikasi

1.  Clone repository ini:
    ```bash
    git clone https://github.com/Arcel-S/uts-pemweb-123140054.git
    ```
2.  Masuk ke folder proyek:
    ```bash
    cd uts-pemweb-123140054
    ```
3.  Instal dependencies:
    ```bash
    npm install
    ```
4.  Jalankan aplikasi dalam mode development:
    ```bash
    npm run dev
    ```
    Aplikasi akan terbuka di *browser* Anda (biasanya di `http://localhost:5173`).

---

## 6. Pencapaian Kualitas & Arsitektur Lanjutan

Proyek ini dirancang dengan standar *software engineering* modern:

| Kriteria | Implementasi |
| :--- | :--- |
| **State Management** | Menggunakan **`useReducer`** dan **`useContext`** untuk *state management* terpusat, menghilangkan *prop drilling*. |
| **Optimasi Performa** | Menggunakan **`useCallback`** (fungsi handler), **`useMemo`** (komputasi judul), dan **`useRef`** (manajemen fokus DOM). |
| **Custom Hook** | Implementasi **`useLocalStorage`** untuk manajemen *theme* yang persisten. |
| **Kualitas Kode** | Penggunaan **`PropTypes`** untuk validasi *props* dan *commit history* yang bersih dan jelas. |