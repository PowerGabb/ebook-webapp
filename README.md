# ReadBooks - Aplikasi Baca Buku Online

ReadBooks adalah aplikasi baca buku online yang memungkinkan pengguna untuk membaca buku secara online yang di buat untuk tujuan mempermudah pengguna untuk membaca buku secara online, project di mulai dari tugas bahan interview untuk GGUC.

## Stack

- Postman
- PostgreSql
- Vite
- React
- TypeScript
- Tailwind CSS
- Prisma
- Midtrans
- Epubjs
- Midtrans
- Express
- Nodemon
- Multer
- Joi
- Bcrypt
- Jsonwebtoken
- Lucide React
- React Reader
- React Router Dom
- Dan lainnya

## Fitur Utama

### 1. Authentication Pengguna
- Register dan login pengguna
- JWT Authentication
- Refresh Token Untuk Keamanan

### 2. Dashboard Admin
- CRUD Buku
- CRUD Kategori
- CRUD Pengguna

### 3. Dashboard Pengguna
- Baca Buku
- Cari Buku
- Favorite Buku
- Pengaturan Akun

### 4. Pembayaran
- Pembayaran Premium

## Cara Install


- clone repository
```bash
git clone https://github.com/PowerGabb/ebook-webapp
```

- cd ke folder backend
```bash
cd backend
```

- install dependencies
```bash
npm install
```

- konfigurasi env
```bash
JWT_SECRET=
JWT_EXPIRATION=10s
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRATION=7d

MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
FRONTEND_URL=
DATABASE_URL=

```

- update database
```bash
npx prisma migrate dev --name dev
```

- tambah admin user dengan role admin

- run server
```bash
npm start
```

- cd ke folder frontend
```bash
cd frontend
```

- install dependencies
```bash
npm install
```

- run server
```bash
npm run dev
```


## Catatan Fitur Lanjutan

- Text To Speech Buku Dan Chat AI agar bisa membaca buku dan bisa berkomunikasi dengan AI menggunakan API OpenAI dan TopMediAI
- Fitur Pembayaran Premium untuk unlock fitur text to speech dan chat ai unlimited





















