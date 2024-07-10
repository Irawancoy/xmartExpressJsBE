const { GraphQLList, GraphQLString, GraphQLObjectType } = require('graphql')
const TransaksiTypes = require('../types/transaksiTypes')
const redisClient = require('../../redis/redis')

const RootQuery = new GraphQLObjectType({
   name: 'RootQueryType',
   fields: {
      transaksi: {
         type
            : new GraphQLList(TransaksiTypes),
         async resolve(parent, args) {
            try {
               const keys = await redisClient.keys('transaksi:*')
               const transaksiList = await Promise.all(keys.map(async key => {
                  const rawData = await redisClient.get(key)
                  return JSON.parse(rawData)
               }))
               return transaksiList
            } catch (error) {
               throw new Error(error)
            }
         }
      },
      transaksiByQRCode: {
         type: new GraphQLList(TransaksiTypes),
         args: { qr_code: { type: GraphQLString } },
         async resolve(parent, args) {
            try {
               const { qr_code } = args
               const keys = await redisClient.keys(`transaksi:${qr_code}:*`)
               const transaksiList = await Promise.all(keys.map(async key => {
                  const RawData = await redisClient.get(key)
                  return JSON.parse(RawData)
               }
               ))
               return transaksiList
            } catch (error) {
               throw new Error(error)
            }
         }
      },
   
         
       
   }
})

module.exports = RootQuery

