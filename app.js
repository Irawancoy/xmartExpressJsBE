const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const cors = require('cors')
const schema = require('./graphql/schema')
const redisClient = require('./redis/redis')
const Transaksi = require('./models/transaksiModel')
const tranferData = require('../xmart/tranferTransaksi')
const { connectMongoDB,dbPostgres } = require('./database/db')

const app = express()

app.use(express.json())

app.use(cors())

// Connect to MongoDB
connectMongoDB()




app.use('/graphql', graphqlHTTP({
   schema: schema,
   graphiql: true
}))

// endpoint untuk tranfer data
app.get('/tranfer-data/:qrCode', async (req, res) => {
   try {
      const { qrCode } = req.params
      await tranferData(qrCode)
      res.status(200).json({ message: 'Data berhasil ditransf' })
   } catch (error) {
      res.status(500).json({ message: 'Data gagal ditransfer' })
   }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`)
})