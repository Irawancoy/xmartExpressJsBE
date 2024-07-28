const express = require('express') // Mengimpor framework Express untuk membuat server
const { graphqlHTTP } = require('express-graphql') // Mengimpor middleware express-graphql untuk menjalankan server GraphQL
const cors = require('cors') // Mengimpor middleware CORS untuk mengizinkan permintaan lintas domain
const schema = require('./graphql/schema') // Mengimpor skema GraphQL
const tranferData = require('../xmart/tranferTransaksi') // Mengimpor fungsi untuk mentransfer data
const { connectMongoDB } = require('./database/db') // Mengimpor fungsi untuk menghubungkan ke MongoDB

const app = express() // Membuat instance aplikasi Express

app.use(express.json()) // Middleware untuk menguraikan JSON dalam permintaan HTTP

app.use(cors()) // Middleware untuk mengaktifkan CORS

// Connect to MongoDB
connectMongoDB() // Menghubungkan ke MongoDB

app.use('/graphql', graphqlHTTP({
   schema: schema, // Mengatur skema GraphQL
   graphiql: true // Mengaktifkan antarmuka pengguna GraphiQL untuk pengujian
}))

// Endpoint untuk mentransfer data
app.get('/tranfer-data/:qrCode', async (req, res) => {
   try {
      const { qrCode } = req.params // Mendapatkan qrCode dari parameter URL
      await tranferData(qrCode) // Memanggil fungsi untuk mentransfer data
      res.status(200).json({ message: 'Data berhasil ditransfer' }) // Mengirim respons sukses
   } catch (error) {
      res.status(500).json({ message: 'Data gagal ditransfer' }) // Mengirim respons kesalahan
   }
})

const PORT = process.env.PORT || 5000 // Mengatur port untuk server
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`) // Menjalankan server dan mencetak pesan ke konsol
})
