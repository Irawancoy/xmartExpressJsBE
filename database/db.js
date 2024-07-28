// Menggunakan pustaka dotenv untuk memuat variabel lingkungan dari file .env
require('dotenv').config();

// Mengimpor mongoose untuk koneksi ke MongoDB
const mongoose = require('mongoose');

// Mengimpor pg-promise untuk koneksi ke PostgreSQL
const pgp = require('pg-promise')();

// Fungsi untuk menghubungkan ke MongoDB
const connectMongoDB = async () => {
   try {
      // Mencoba menghubungkan ke MongoDB dengan URL yang diambil dari variabel lingkungan
      await mongoose.connect(process.env.MONGODB_URL, {});
      console.log('MongoDB connected');
   } catch (error) {
      // Menangkap dan mencetak kesalahan jika koneksi gagal
      console.error(error);
   }
}

// Koneksi ke PostgreSQL menggunakan konfigurasi dari variabel lingkungan
const dbPostgres = pgp({
   user: process.env.PG_USER, // Nama pengguna PostgreSQL
   password: process.env.PG_PASSWORD, // Kata sandi PostgreSQL
   host: process.env.PG_HOST, // Host PostgreSQL
   port: process.env.PG_PORT, // Port PostgreSQL
   database: process.env.PG_DATABASE // Nama database PostgreSQL
});

// Mencoba menghubungkan ke PostgreSQL
dbPostgres.connect()
   .then(() => {
      console.log('PostgreSQL connected');
   })
   .catch((error) => {
      // Menangkap dan mencetak kesalahan jika koneksi gagal
      console.error(error);
   });

// Mengekspor fungsi connectMongoDB dan objek dbPostgres
module.exports = { connectMongoDB, dbPostgres };
