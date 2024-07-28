const { GraphQLObjectType, GraphQLString, GraphQLInt } = require('graphql');

// Definisikan tipe GraphQL untuk entitas 'Transaksi'
const TransaksiTypes = new GraphQLObjectType({
  name: "Transaksi", // Nama tipe GraphQL
  fields: () => ({ // Mendefinisikan field yang ada pada tipe ini
    _id: { type: GraphQLString }, // Field '_id' dengan tipe GraphQLString
    qr_code: { type: GraphQLString }, // Field 'qr_code' dengan tipe GraphQLString
    rfid: { type: GraphQLString }, // Field 'rfid' dengan tipe GraphQLString
    nama_barang: { type: GraphQLString }, // Field 'nama_barang' dengan tipe GraphQLString
    harga_satuan: { type: GraphQLInt }, // Field 'harga_satuan' dengan tipe GraphQLInt
    jumlah: { type: GraphQLInt }, // Field 'jumlah' dengan tipe GraphQLInt
    date: { type: GraphQLString }, // Field 'date' dengan tipe GraphQLString
  }),
});

module.exports = TransaksiTypes // Mengekspor tipe Transaksi untuk digunakan di bagian lain dari aplikasi
