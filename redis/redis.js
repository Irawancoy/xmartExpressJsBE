// Mengimpor pustaka redis untuk menghubungkan ke server Redis
const redis = require('redis');

// Membuat klien Redis baru
const redisClient = redis.createClient();

// Menangani event 'connect' yang terjadi saat koneksi ke Redis berhasil
redisClient.on('connect', () => {
    console.log('Redis connected');
});

// Menangani event 'error' yang terjadi jika ada kesalahan saat menghubungkan ke Redis
redisClient.on('error', (error) => {
    console.error(error);
});

// Menghubungkan ke server Redis
redisClient.connect();

// Mengekspor objek redisClient sehingga dapat digunakan di bagian lain dari aplikasi
module.exports = redisClient;
