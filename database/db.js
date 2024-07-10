require('dotenv').config();
const mongoose = require('mongoose');
const pgp = require('pg-promise')();

// Connect to MongoDB
const connectMongoDB = async () => {
      try {
         await mongoose.connect(process.env.MONGODB_URL, {
         })
         console.log('MongoDB connected');
      } catch (error) {
         console.error(error);
      }
}

   
// Connect to PostgreSQL
const dbPostgres = pgp({
   user: process.env.PG_USER,
   password: process.env.PG_PASSWORD,
   host: process.env.PG_HOST,
   port: process.env.PG_PORT,
   database: process.env.PG_DATABASE
})

dbPostgres.connect()
   .then(() => {
      console.log('PostgreSQL connected')
   })
   .catch((error) => {
      console.error(error)
   })

module.exports = { connectMongoDB, dbPostgres }