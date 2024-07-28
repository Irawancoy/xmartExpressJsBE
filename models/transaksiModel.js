// Mengimpor pustaka mongoose untuk bekerja dengan MongoDB
const mongoose = require('mongoose');
// Mengambil objek Schema dari mongoose untuk membuat skema
const Schema = mongoose.Schema;

// Mendefinisikan skema untuk koleksi "transaksi"
const transaksiSchema = new Schema({
  qr_code: String, // Menyimpan QR code sebagai string
  rfid: String, // Menyimpan RFID sebagai string
  nama_barang: String, // Menyimpan nama barang sebagai string
  harga_satuan: Number, // Menyimpan harga satuan sebagai angka
  jumlah: Number, // Menyimpan jumlah sebagai angka
  date: {
    type: Date, // Menyimpan tanggal sebagai tipe Date
    default: Date.now, // Nilai default adalah tanggal dan waktu saat dokumen dibuat
  },
});

// Membuat model Mongoose berdasarkan skema yang didefinisikan
const Transaksi = mongoose.model('transaksi', transaksiSchema);

// Mengekspor model Transaksi sehingga dapat digunakan di bagian lain dari aplikasi
module.exports = Transaksi;
