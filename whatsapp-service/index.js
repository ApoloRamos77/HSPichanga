const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

// Inicializamos el cliente de WhatsApp usando LocalAuth para mantener la sesión
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

let isClientReady = false;

client.on('qr', (qr) => {
    // Genera y muestra el QR en la terminal
    console.log('\n--- ESCANEA EL CÓDIGO QR PARA INICIAR SESIÓN ---');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('¡Cliente de WhatsApp está listo!');
    isClientReady = true;
});

client.on('authenticated', () => {
    console.log('Autenticación exitosa.');
});

client.on('auth_failure', msg => {
    console.error('Hubo un fallo en la autenticación', msg);
    isClientReady = false;
});

client.on('disconnected', (reason) => {
    console.log('Cliente desconectado:', reason);
    isClientReady = false;
});

// Inicializamos el cliente de WhatsApp
client.initialize();

// Endpoint para enviar mensajes
app.post('/send', async (req, res) => {
    if (!isClientReady) {
        return res.status(503).json({ success: false, error: 'El cliente de WhatsApp aún no está listo o no ha escaneado el QR.' });
    }

    const { number, message } = req.body;

    if (!number || !message) {
        return res.status(400).json({ success: false, error: 'Se requiere "number" y "message" en el body.' });
    }

    try {
        // whatsapp-web.js requiere el ID del chat en el formato "numero@c.us"
        const chatId = `${number}@c.us`;
        
        // Enviamos el mensaje
        await client.sendMessage(chatId, message);
        
        console.log(`Mensaje enviado exitosamente a ${number}`);
        return res.status(200).json({ success: true, message: 'Mensaje enviado' });
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint de health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', whatsappReady: isClientReady });
});

app.listen(port, () => {
    console.log(`Servicio de WhatsApp escuchando en http://localhost:${port}`);
});
