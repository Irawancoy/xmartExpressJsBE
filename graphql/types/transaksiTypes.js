const { GraphQLObjectType, GraphQLString, GraphQLInt } = require('graphql');

const TransaksiTypes = new GraphQLObjectType({
   name: 'Transaksi',
   fields: () => ({
      _id: { type: GraphQLString },
      qr_code: { type: GraphQLString },
      rfid: { type: GraphQLString },
      harga_satuan: { type: GraphQLInt },
      jumlah: { type: GraphQLInt },
      date: { type: GraphQLString }
   })
})

module.exports = TransaksiTypes