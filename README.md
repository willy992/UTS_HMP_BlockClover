# SIMOBILE

SIMOBILE adalah aplikasi Point of Sale sederhana berbasis Ionic Angular. Aplikasi ini digunakan untuk mengelola produk, keranjang belanja, dan transaksi secara lokal tanpa backend.

Proyek ini dibuat untuk memenuhi tugas UTS mata kuliah Hybrid Mobile Programming.

## Teknologi

- Ionic 9
- Angular 22
- TypeScript
- SCSS
- RxJS
- Angular Reactive Forms
- Local Storage
- Angular NgModule

Semua halaman menggunakan pendekatan **NgModule** dan lazy loading. Proyek ini tidak menggunakan standalone component.

## Fitur

### Dashboard

- Menampilkan jumlah produk tersedia dibandingkan total produk.
- Menampilkan jumlah transaksi hari ini.
- Menampilkan omzet dan keuntungan hari ini.
- Menampilkan tiga produk terlaris secara keseluruhan.
- Membuka daftar produk, riwayat transaksi, laporan admin, dan peringkat produk langsung dari kartu dashboard.
- Data dashboard diperbarui otomatis setelah produk atau transaksi berubah.

### Produk

- Menampilkan daftar produk dummy.
- Mencari produk berdasarkan nama atau kategori.
- Menampilkan detail produk.
- Menambahkan produk baru.
- Mengedit produk.
- Validasi form produk.
- Menampilkan harga, stok, dan jumlah terjual.
- Menampilkan ilustrasi produk langsung pada setiap kartu.
- Menambahkan produk ke keranjang dari kartu atau halaman detail.
- Menampilkan label **Habis** ketika stok produk kosong.
- Menonaktifkan pembelian ketika stok habis.
- Menyimpan perubahan produk secara lokal.

### Keranjang

- Menampilkan produk yang dipilih.
- Menambah dan mengurangi quantity.
- Mengubah quantity secara langsung.
- Membatasi quantity berdasarkan stok produk.
- Menghapus produk dari keranjang.
- Menghitung subtotal dan total belanja.
- Menampilkan feedback berhasil atau gagal.
- Mengonfirmasi keranjang menjadi transaksi.
- Menampilkan badge jumlah barang pada tombol keranjang di halaman produk.
- Menyimpan isi keranjang secara lokal agar tetap tersedia setelah reload.

### Transaksi

- Menyimpan hasil konfirmasi transaksi.
- Mengurangi stok produk setelah transaksi berhasil.
- Menambah jumlah produk terjual.
- Menampilkan riwayat transaksi yang dikelompokkan per hari.
- Menampilkan detail transaksi.
- Menampilkan waktu, daftar produk, quantity, subtotal, dan total transaksi.
- Menyimpan transaksi secara lokal.
- Memperbarui riwayat secara otomatis setelah checkout.

### Laporan Admin

- Menampilkan omzet dan keuntungan hari ini.
- Menampilkan total penjualan dan keuntungan untuk setiap hari.
- Menampilkan total penjualan dan keuntungan untuk setiap transaksi.
- Menampilkan modal, penjualan, dan keuntungan setiap produk pada detail transaksi admin.
- Menyimpan snapshot harga beli saat checkout agar keuntungan historis tetap akurat.

### Navigasi dan Tampilan

- Navigasi utama menggunakan Ionic Tabs.
- Sidebar untuk navigasi tambahan.
- Halaman profil.
- Halaman settings.
- Halaman about.
- Dark mode yang disimpan pada perangkat.
- Tema hijau–kuning untuk light mode dan dark mode.
- Animasi saat halaman ditampilkan.
- Animasi feedback pada keranjang.
- Dukungan pengaturan `prefers-reduced-motion`.

## Struktur Navigasi

### Tab utama

| Halaman   | Route                | Fungsi                            |
| --------- | -------------------- | --------------------------------- |
| Dashboard | `/tabs/dashboard`    | Ringkasan transaksi dan penjualan |
| Produk    | `/tabs/products`     | Daftar dan pencarian produk       |
| Transaksi | `/tabs/transactions` | Riwayat transaksi                 |
| Profil    | `/tabs/profile`      | Informasi profil pengguna         |

### Route tambahan

| Halaman          | Route               |
| ---------------- | ------------------- |
| Tambah produk    | `/product/new`      |
| Detail produk    | `/product/:id`      |
| Edit produk      | `/product/:id/edit` |
| Keranjang        | `/cart`             |
| Detail transaksi | `/transaction/:id`                 |
| Laporan admin    | `/sales-report`                    |
| Detail laporan   | `/sales-report/transaction/:id`    |
| Peringkat produk | `/top-products`                    |
| Settings         | `/settings`                        |
| About            | `/about`                           |

Nilai `:id` diganti dengan ID produk atau transaksi yang dipilih.

## Struktur Folder

```text
src/
├── app/
│   ├── models/
│   │   ├── cart-item.model.ts
│   │   ├── product.model.ts
│   │   └── transaction.model.ts
│   ├── pages/
│   │   ├── about/
│   │   ├── cart/
│   │   ├── dashboard/
│   │   ├── product-detail/
│   │   ├── product-form/
│   │   ├── products/
│   │   ├── profile/
│   │   ├── settings/
│   │   ├── transactiondetails/
│   │   └── transactions/
│   ├── services/
│   │   ├── cart.service.ts
│   │   ├── product.service.ts
│   │   └── transaction.service.ts
│   ├── tabs/
│   ├── app-routing.module.ts
│   ├── app.component.html
│   ├── app.component.scss
│   ├── app.component.ts
│   └── app.module.ts
├── assets/
├── theme/
│   └── variables.scss
└── global.scss
```

## Pembagian Tugas

| Anggota | Branch   | Tanggung jawab                                                                                                     |
| ------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| Willy   | `main`   | Fondasi aplikasi, tabs, sidebar, profil, settings, about, tema, animasi, routing pusat, integrasi, dan dokumentasi |
| Jason   | `Jason`  | TransactionService, riwayat transaksi, detail transaksi, dan ringkasan dashboard                                   |
| Felix   | `Felix`  | CartService, halaman keranjang, perhitungan total, konfirmasi transaksi, dan feedback cart                         |
| Dariel  | `dariel` | Daftar produk, pencarian, detail produk, form tambah/edit produk, dan integrasi tombol beli                        |

## Persyaratan

Pastikan komputer sudah memiliki:

- Git
- Node.js
- npm

Periksa instalasi:

```bash
git --version
node --version
npm --version
```

Ionic CLI global bersifat opsional karena proyek dapat dijalankan melalui npm script.

## Instalasi

Clone repository:

```bash
git clone https://github.com/willy992/UTS-HMP-IONIC.git
```

Masuk ke folder proyek:

```bash
cd UTS-HMP-IONIC
```

Install dependency:

```bash
npm install
```

## Menjalankan Aplikasi

Jalankan development server:

```bash
npm start
```

Buka alamat berikut melalui browser:

```text
http://localhost:4200
```

Tekan `Ctrl + C` untuk menghentikan development server.

## Alur Penggunaan

1. Buka tab **Produk**.
2. Gunakan kolom pencarian untuk mencari produk.
3. Tekan **Tambah ke Keranjang** pada kartu produk atau buka detail produk.
4. Periksa badge jumlah barang pada tombol keranjang.
5. Buka halaman **Keranjang** dari tombol pada halaman produk.
6. Atur quantity sesuai kebutuhan.
7. Tekan **Konfirmasi Transaksi**.
8. Buka tab **Transaksi** untuk melihat transaksi yang dibuat.
9. Tekan transaksi untuk membuka detailnya.
10. Buka **Dashboard** untuk melihat ringkasan yang sudah diperbarui otomatis.
11. Tekan kartu **Total Hari Ini** untuk membuka laporan admin.

Untuk menambah produk:

1. Buka tab **Produk**.
2. Tekan tombol `+`.
3. Isi seluruh data wajib.
4. Tekan tombol simpan.

Untuk mengedit produk:

1. Buka detail produk.
2. Tekan **Edit Produk**.
3. Ubah data yang diperlukan.
4. Tekan tombol simpan.

## Build

Jalankan production build:

```bash
npm run build
```

Hasil build dibuat di folder `www`.

## Pengujian

Jalankan unit test satu kali:

```bash
npm test -- --watch=false
```

Jalankan pemeriksaan lint:

```bash
npm run lint
```

## Penyimpanan Lokal

SIMOBILE belum menggunakan API atau backend eksternal.

Data berikut disimpan secara lokal pada browser atau perangkat:

- Produk dan perubahan produk.
- Isi dan quantity keranjang.
- Riwayat transaksi.
- Preferensi dark mode.

Data local storage dapat dihapus melalui developer tools browser jika aplikasi perlu dikembalikan ke kondisi awal.

## Alur Kerja Git

Sebelum mulai bekerja:

```bash
git checkout main
git pull origin main
```

Pindah ke branch masing-masing:

```bash
git checkout nama-branch
```

Gabungkan pembaruan dari `main` jika diperlukan:

```bash
git merge main
```

Sebelum commit:

```bash
git status
git diff
```

Stage hanya file yang berhubungan dengan langkah tersebut:

```bash
git add path/file-yang-diubah
```

Buat commit yang menjelaskan satu perubahan:

```bash
git commit -m "feat: describe the completed feature"
```

Push branch:

```bash
git push origin nama-branch
```
