const Transaksi = require('./models/transaksiModel');
const redisClient = require('./redis/redis');
require('dotenv').config();
const { dbPostgres } = require('./database/db');

async function transferData(qrCode) {
    try {
        const dataTransaksi = await Transaksi.find({ qr_code: qrCode });
        if (dataTransaksi.length === 0) {
            throw new Error('Data tidak ditemukan');
        }
            // Connect to PostgreSQL
            const db = dbPostgres;

            // Transfer data to PostgreSQL
            await Promise.all(dataTransaksi.map(async (item) => {
                const data = {
                    transaksi_id: item._id.toString(),
                    qr_code: item.qr_code,
                    rfid: item.rfid,
                    harga_satuan: item.harga_satuan,
                    jumlah: item.jumlah,
                    date: item.date
                };
                await db.query(
                    `INSERT INTO transaksi (transaksi_id, qr_code, rfid, harga_satuan, jumlah, date) VALUES ($1, $2, $3, $4, $5, $6)`,
                    [data.transaksi_id, data.qr_code, data.rfid, data.harga_satuan, data.jumlah, data.date]
                );
            }));
        
        // Delete data from MongoDB
        await Transaksi.deleteMany({ qr_code: qrCode });

        // Delete cache
        const keys = await redisClient.keys(`transaksi:${qrCode}:*`);
        if (keys.length > 0) {
            await Promise.all(keys.map((key) => redisClient.del(key)));
        } else {
            console.log('Cache tidak ditemukan');
        }
        
     

    } catch (error) {
        throw new Error(error);
    
    }
    



}

module.exports = transferData;
