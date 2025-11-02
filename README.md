<img width="1892" height="947" alt="image" src="https://github.com/user-attachments/assets/1c76e6c8-5cb5-4d78-9eea-5a2de688a8b3" /><img width="1892" height="947" alt="image" src="https://github.com/user-attachments/assets/206bb4db-419a-425d-8a21-ed72a64a82fb" /><img width="1891" height="952" alt="image" src="https://github.com/user-attachments/assets/88134884-4003-4102-af68-0b2c8085a919" /># 📰 Digit 4 – News Portal

**Proyek Ujian Tengah Semester (UTS) Pemrograman Web | 123140054**

| Nama | Marcel Kevin Togap Siagian |
| :--- | :--- |
| NIM | **123140054** |
| Repository GitHub | **https://github.com/Arcel-S/uts-pemweb-123140054.git** |

---

## 🚀 1. Deskripsi & Tujuan Proyek

Aplikasi portal berita interaktif yang dibangun menggunakan **ReactJS (Vite)** dan di-*host* di **Vercel**.

**PENTING: Perubahan Sumber Data**
Sesuai arahan, proyek ini **menggunakan data JSON lokal** (disimpan di `/public/api/`) untuk mensimulasikan respons dari NewsAPI. Hal ini dilakukan karena *endpoint* NewsAPI gratis memblokir permintaan yang berasal dari domain *hosting* (seperti Vercel), dan hanya mengizinkan `localhost`.

Meskipun datanya statis, seluruh arsitektur *fetching*, *loading state*, dan *error handling* tetap dipertahankan seolah-olah mengambil data dari API *live*.

### Teknologi yang Digunakan
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## 🌐 2. Deployment

Aplikasi sudah di-*deploy* dan dapat diakses melalui link berikut:

**Link Deployment Vercel:** [LINK VERCEL](https://uts-pemweb-123140054.vercel.app/)

---

## 🛠️ 3. Fitur Utama

* **Autentikasi Pengguna:** Sistem **Login, Register, dan Logout** penuh yang terhubung ke `localStorage`.
* **Berita Favorit:** Pengguna yang sudah *login* dapat **menyimpan dan melihat** artikel favorit mereka.
* **Navigasi Kategori:** Filter cepat untuk 5 kategori berita (Business, Apple, Tesla, Technology, Sports).
* **Theming (*Dark Mode*):** Tombol *toggle* Dark/Light mode yang preferensinya disimpan di `localStorage` menggunakan *custom hook*.
* **Advanced Search (Simulasi):** Form pencarian canggih dengan 5+ input (kata kunci, tanggal, *sort by*, bahasa, filter judul).
* **Pagination (Simulasi):** Navigasi "Next/Previous" yang membaca `totalResults` dari *file* JSON.
* **Desain Responsif:** *Layout* yang dioptimalkan untuk *desktop* dan *mobile* menggunakan Flexbox & CSS Grid.

---

## 📸 4. Screenshot Detail Aplikasi

*(Harap ganti placeholder di bawah ini dengan screenshot Anda yang sebenarnya)*

| Tampilan Desktop (Homepage) | Tampilan Mobile (Responsif) |
| :---: | :---: |
| ![Screenshot Homepage](<img width="1891" height="952" alt="image" src="https://github.com/user-attachments/assets/94d67df5-655e-4e98-9646-08fe6c620576" />
) | ![Screenshot Mobile View](![WhatsApp Image 2025-11-02 at 16 31 09_f715b928](https://github.com/user-attachments/assets/1e528263-632e-435d-bc73-8bfa78db0530)
) |
| **Tampilan Login & Favorites** | **Tampilan Dark Mode** |
| ![Screenshot Login](<img width="1894" height="949" alt="image" src="https://github.com/user-attachments/assets/a87d0160-9533-4607-8896-e265d969e156" />
) | ![Screenshot Dark Mode](<img width="1897" height="952" alt="image" src="https://github.com/user-attachments/assets/721c3b61-3d1c-4b4d-894f-41c314bf5009" />
) |

---

## 📦 5. Panduan Instalasi (Lokal)

**Tidak diperlukan API Key.** Proyek ini berjalan 100% menggunakan data JSON lokal yang ada di folder `/public/api/`.

1.  **Clone repository ini:**
    ```bash
    git clone [https://github.com/Arcel-S/uts-pemweb-123140054.git](https://github.com/Arcel-S/uts-pemweb-123140054.git)
    ```
2.  **Masuk ke folder proyek:**
    ```bash
    cd uts-pemweb-123140054
    ```
3.  **Instal dependencies:**
    ```bash
    npm install
    ```
4.  **Jalankan aplikasi:**
    ```bash
    npm run dev
    ```
    Aplikasi akan terbuka di `http://localhost:5173`.

---

## ⭐ 6. Pencapaian Kriteria Penilaian

Proyek ini telah memenuhi dan **melampaui** semua kriteria yang dipersyaratkan.

### A. Kriteria Wajib UTS (CPMK0501 & CPMK0502)

| Aspek | Kriteria | Status |
| :--- | :--- | :--- |
| **Form** | Min. 5 input, validasi HTML5, state management | **✅ Selesai** |
| **Table/Card List** | Data dinamis (min. 3 kolom), dari API (JSON) | **✅ Selesai** |
| **CSS Styling** | Selector, pseudo-class, Flexbox/Grid, Responsive | **✅ Selesai** |
| **HTML5 Structure** | Semantic tags (`<header>`, `<main>`, `<footer>`, dll.) | **✅ Selesai** |
| **Modern JavaScript** | `async/await`, *destructuring*, *arrow functions* | **✅ Selesai** |
| **React (Basic)** | `useState`, `useEffect`, *props*, *conditional render* | **✅ Selesai** |
| **API Integration** | *Fetch*, *loading state*, *error handling* | **✅ Selesai** |
| **Fitur Wajib** | Kategori, Search, Card List, Date Picker, Pagination | **✅ Selesai** |

### B. Arsitektur Lanjutan (Melampaui Kriteria)

| Kriteria | Implementasi |
| :--- | :--- |
| **State Management** | Menggunakan **`useReducer`** dan **`useContext`** untuk *state* global, menghilangkan *prop drilling*. |
| **Optimasi Performa** | Menggunakan **`useCallback`** (fungsi *handler*), **`useMemo`** (komputasi judul), dan **`useRef`** (fokus DOM). |
| **Custom Hook** | Implementasi **`useLocalStorage`** untuk manajemen *theme* dan *user* yang persisten. |
| **Fitur Ekstra** | Sistem **Login/Register/Logout** dan **Favorites** per pengguna (disimpan di `localStorage`). |
| **Kualitas Kode** | Penggunaan **`PropTypes`** untuk validasi *props* dan *repository* dengan *commit history* yang bersih. |
