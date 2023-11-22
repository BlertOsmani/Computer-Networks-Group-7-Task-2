const dgram = require('dgram');

const PORT = 3000; // Numri i portit, duhet të jetë i njëjti me portin e serverit
const IP_ADDRESS = '127.0.0.1'; // IP Adresa e serverit

const client = dgram.createSocket('udp4');

// Dërgoni një kërkesë tek serveri (p.sh., një tekst si kërkesë)
const request = 'Kërkesa nga klienti.';
client.send(request, PORT, IP_ADDRESS, (err) => {
    if (err) {
        console.error('Gabim gjatë dërgimit të kërkesës:', err);
        client.close();
    } else {
        console.log('Kërkesa u dërgua me sukses.');
    }
});

// Handle data from the server
client.on('message', (msg, rinfo) => {
    console.log(`Përgjigja nga serveri: ${msg.toString()} nga ${rinfo.address}:${rinfo.port}`);
    client.close();
});
