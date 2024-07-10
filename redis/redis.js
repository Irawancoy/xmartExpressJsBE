const redis = require('redis')
const redisClient = redis.createClient()

redisClient.on('connect', () => {
    console.log('Redis connected')
})

redisClient.on('error', (error) => {
    console.error(error)
})

redisClient.connect()
  
module.exports = redisClient