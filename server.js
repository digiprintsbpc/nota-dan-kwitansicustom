const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express'); // Tambahan baru
const cors = require('cors');       // Tambahan baru

const app = express();
app.use(express.json());
app.use(cors());

// Inisialisasi bot
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    }
});

client.on('qr', (qr) => {
    console.log('Scan QR Code di bawah ini menggunakan WhatsApp-mu:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot WhatsApp sudah siap dan berhasil terhubung!');
});

// --- INI ADALAH "TELINGA" UNTUK MENDENGAR PERINTAH DARI WEB ---
app.post('/api/kirim-pesan', async (req, res) => {
    const { nomor, pesan } = req.body;
    try {
        // Format nomor WhatsApp: misal 62812... menjadi 62812...@c.us
        const chatId = nomor + "@c.us"; 
        
        // Perintah bot untuk mengirim pesan
        await client.sendMessage(chatId, pesan);
        
        res.json({ status: 'sukses', message: 'Pesan terkirim!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'gagal', message: error.toString() });
    }
});
// --------------------------------------------------------------

client.initialize();

// Nyalakan server API di port 3000
app.listen(3000, () => {
    console.log('⏳ Memulai mesin bot dan API Server di port 3000...');
});