const { GraphQLList, GraphQLString, GraphQLObjectType } = require('graphql');
const TransaksiTypes = require('../types/transaksiTypes');
const redisClient = require('../../redis/redis');

// Definisikan root query untuk GraphQL
const RootQuery = new GraphQLObjectType({
   name: 'RootQueryType', // Nama untuk root query
   fields: {
      transaksi: {
         type: new GraphQLList(TransaksiTypes), // Tipe yang dikembalikan oleh query
         async resolve(parent, args) { // Fungsi resolver untuk mendapatkan semua transaksi dari cache Redis
            try {
               const keys = await redisClient.keys('transaksi:*'); // Mendapatkan semua kunci yang sesuai dengan pola 'transaksi:*' dari Redis
               const transaksiList = await Promise.all(keys.map(async key => {
                  const rawData = await redisClient.get(key); // Mengambil data transaksi dari Redis berdasarkan kunci
                  return JSON.parse(rawData); // Mengubah data transaksi dari string JSON menjadi objek JavaScript
               }));
               return transaksiList; // Mengembalikan daftar transaksi
            } catch (error) {
               throw new Error(error); // Menangani error
            }
         }
      },
      transaksiByQRCode: {
         type: new GraphQLList(TransaksiTypes), // Tipe yang dikembalikan oleh query
         args: { qr_code: { type: GraphQLString } }, // Argumen yang diterima oleh query
         async resolve(parent, args) { // Fungsi resolver untuk mendapatkan transaksi berdasarkan QR code dari cache Redis
            try {
               const { qr_code } = args;
               const keys = await redisClient.keys(`transaksi:${qr_code}:*`); // Mendapatkan semua kunci yang sesuai dengan pola 'transaksi:qr_code:*' dari Redis
               const transaksiList = await Promise.all(keys.map(async key => {
                  const RawData = await redisClient.get(key); // Mengambil data transaksi dari Redis berdasarkan kunci
                  return JSON.parse(RawData); // Mengubah data transaksi dari string JSON menjadi objek JavaScript
               }));
               return transaksiList; // Mengembalikan daftar transaksi
            } catch (error) {
               throw new Error(error); // Menangani error
            }
         }
      },
   }
});

module.exports = RootQuery; // Mengekspor RootQuery untuk digunakan dalam skema GraphQL
