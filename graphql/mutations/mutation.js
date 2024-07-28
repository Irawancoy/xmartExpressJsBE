const { GraphQLString, GraphQLObjectType, GraphQLInt } = require('graphql');
const Transaksi = require('../../models/transaksiModel');
const transaksiTypes = require('../types/transaksiTypes');
const redisClient = require('../../redis/redis');
const { errors } = require('pg-promise');

// Definisikan root mutation untuk GraphQL
const RootMutation = new GraphQLObjectType({
  name: "RootMutationType", // Nama untuk root mutation
  fields: {
    addTransaksi: {
      type: transaksiTypes, // Tipe yang dikembalikan oleh mutation
      args: {
        qr_code: { type: GraphQLString }, // Argumen yang diterima oleh mutation
        rfid: { type: GraphQLString },
        nama_barang: { type: GraphQLString },
        harga_satuan: { type: GraphQLInt },
        jumlah: { type: GraphQLInt },
      },
      async resolve(parent, args) { // Fungsi resolver untuk menambahkan transaksi
        const { qr_code, rfid, nama_barang, harga_satuan, jumlah } = args;
        const transaksi = new Transaksi({
          qr_code,
          rfid,
          nama_barang,
          harga_satuan,
          jumlah,
        });
        try {
          const savedTransaksi = await transaksi.save(); // Menyimpan transaksi ke MongoDB
          let objectIdString = savedTransaksi._id.toString();
          let key = `transaksi:${qr_code}:${rfid}:${nama_barang}:${harga_satuan}:${jumlah}:${objectIdString}`;
          redisClient.set(key, JSON.stringify(savedTransaksi)); // Menyimpan transaksi ke cache Redis
          return savedTransaksi; // Mengembalikan transaksi yang disimpan
        } catch (error) {
          throw new Error(error); // Menangani error
        }
      },
    },
    deleteTransaksi: {
      type: transaksiTypes, // Tipe yang dikembalikan oleh mutation
      args: { _id: { type: GraphQLString } }, // Argumen yang diterima oleh mutation
      async resolve(parent, args) { // Fungsi resolver untuk menghapus transaksi
        const { _id } = args;
        try {
          const deletedTransaksi = await Transaksi.findByIdAndDelete(_id); // Menghapus transaksi dari MongoDB
          if (!deletedTransaksi) {
            throw new Error(errors.message); // Menangani error jika transaksi tidak ditemukan
          }
          let objectIdString = deletedTransaksi._id.toString();
          let key = `transaksi:${deletedTransaksi.qr_code}:${deletedTransaksi.rfid}:${deletedTransaksi.nama_barang}:${deletedTransaksi.harga_satuan}:${deletedTransaksi.jumlah}:${objectIdString}`;
          redisClient.del(key); // Menghapus transaksi dari cache Redis
          return deletedTransaksi; // Mengembalikan transaksi yang dihapus
        } catch (error) {
          throw new Error(error); // Menangani error
        }
      },
    },
    updateJumlahBarangTransaksi: {
      type: transaksiTypes, // Tipe yang dikembalikan oleh mutation
      args: {
        _id: { type: GraphQLString }, // Argumen yang diterima oleh mutation
        jumlah: { type: GraphQLInt },
      },
      async resolve(parent, args) { // Fungsi resolver untuk memperbarui jumlah barang dalam transaksi
        const { _id, jumlah } = args;
        try {
          const originalTransaksi = await Transaksi.findById(_id); // Mengambil transaksi dari MongoDB berdasarkan ID
          if (!originalTransaksi) {
            throw new Error("Transaksi tidak ditemukan"); // Menangani error jika transaksi tidak ditemukan
          }
          let oldObjectIdString = originalTransaksi._id.toString();
          let oldKey = `transaksi:${originalTransaksi.qr_code}:${originalTransaksi.rfid}:${originalTransaksi.nama_barang}:${originalTransaksi.harga_satuan}:${originalTransaksi.jumlah}:${oldObjectIdString}`;
          console.log("Old Key:", oldKey);
          await redisClient.del(oldKey); // Menghapus cache transaksi lama dari Redis
          console.log("Cache lama berhasil dihapus");
          originalTransaksi.jumlah = jumlah; // Memperbarui jumlah barang dalam transaksi
          const updatedTransaksi = await originalTransaksi.save(); // Menyimpan perubahan transaksi ke MongoDB
          if (!updatedTransaksi) {
            throw new Error("Error updating transaction"); // Menangani error jika transaksi gagal diperbarui
          }
          let newObjectIdString = updatedTransaksi._id.toString();
          let newKey = `transaksi:${updatedTransaksi.qr_code}:${updatedTransaksi.rfid}:${updatedTransaksi.nama_barang}:${updatedTransaksi.harga_satuan}:${updatedTransaksi.jumlah}:${newObjectIdString}`;
          console.log("New Key:", newKey);
          await redisClient.set(newKey, JSON.stringify(updatedTransaksi)); // Menyimpan transaksi yang diperbarui ke cache Redis
          return updatedTransaksi; // Mengembalikan transaksi yang diperbarui
        } catch (error) {
          throw new Error(error.message); // Menangani error
        }
      },
    },
  },
});

module.exports = RootMutation; // Mengekspor RootMutation untuk digunakan dalam skema GraphQL
