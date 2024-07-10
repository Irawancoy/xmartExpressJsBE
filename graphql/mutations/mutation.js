const { GraphQLString, GraphQLObjectType, GraphQLInt, GraphQLID } = require('graphql')
const Transaksi = require('../../models/transaksiModel')
const transaksiTypes = require('../types/transaksiTypes')
const redisClient  = require('../../redis/redis')
const { errors } = require('pg-promise')

const RootMutation = new GraphQLObjectType({
   name: 'RootMutationType',
   fields: {
      addTransaksi: {
         type: transaksiTypes,
         args: {
            qr_code: { type: GraphQLString },
            rfid: { type: GraphQLString },
            harga_satuan: { type: GraphQLInt },
            jumlah: { type: GraphQLInt }
         },
         async resolve(parent, args) {
            const { qr_code, rfid, harga_satuan, jumlah } = args
            const transaksi = new Transaksi({ qr_code, rfid, harga_satuan, jumlah })
            try {
               const savedTransaksi = await transaksi.save()
               let objectIdString = savedTransaksi._id.toString()
               let key = `transaksi:${qr_code}:${rfid}:${harga_satuan}:${jumlah}:${objectIdString}`
               redisClient.set(key, JSON.stringify(savedTransaksi))
               return savedTransaksi
            } catch (error) {
               throw new Error(error)
            }
         }
      },
      deleteTransaksi: {
         type: transaksiTypes,
         args: { _id: { type: GraphQLString } },
         async resolve(parent, args) {
            const { _id } = args
            try {
               const deletedTransaksi = await Transaksi.findByIdAndDelete(_id)

              if (!deletedTransaksi) {
                 throw new Error(errors.message)
               }
               let objectIdString = deletedTransaksi._id.toString()
               let key = `transaksi:${deletedTransaksi.qr_code}:${deletedTransaksi.rfid}:${deletedTransaksi.harga_satuan}:${deletedTransaksi.jumlah}:${objectIdString}`
               redisClient.del(key)
               return deletedTransaksi
            } catch (error) {
               throw new Error(error)
            }
         }
      },
      updateJumlahBarangTransaksi : {
         type: transaksiTypes,
         args: {
            _id: { type: GraphQLString },
            jumlah: { type: GraphQLInt }
         },
         async resolve(parent, args) {
            const { _id, jumlah } = args;
            try {
               // Fetch the original transaction details
               const originalTransaksi = await Transaksi.findById(_id);
               if (!originalTransaksi) {
                  throw new Error("Transaksi tidak ditemukan");
               }
     
               // Generate the old cache key
               let oldObjectIdString = originalTransaksi._id.toString();
               let oldKey = `transaksi:${originalTransaksi.qr_code}:${originalTransaksi.rfid}:${originalTransaksi.harga_satuan}:${originalTransaksi.jumlah}:${oldObjectIdString}`;
               console.log('Old Key:', oldKey);
     
               // Delete the old cache
               await redisClient.del(oldKey);
               console.log('Cache lama berhasil dihapus');
     
               // Update the transaction
               originalTransaksi.jumlah = jumlah;
               const updatedTransaksi = await originalTransaksi.save();
               if (!updatedTransaksi) {
                  throw new Error("Error updating transaction");
               }
     
               // Generate the new cache key
               let newObjectIdString = updatedTransaksi._id.toString();
               let newKey = `transaksi:${updatedTransaksi.qr_code}:${updatedTransaksi.rfid}:${updatedTransaksi.harga_satuan}:${updatedTransaksi.jumlah}:${newObjectIdString}`;
               console.log('New Key:', newKey);
     
               // Set the new cache
               await redisClient.set(newKey, JSON.stringify(updatedTransaksi));
     
               return updatedTransaksi;
            } catch (error) {
               throw new Error(error.message);
            }
         }
      }

        
   }
})

module.exports = RootMutation


