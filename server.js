const dgram = require('dgram');

const PORT = 3000; // Numri i portit, mund ta ndryshoni sipas nevojës

const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
    console.log(`Marrë nga klienti: ${msg} nga ${rinfo.address}:${rinfo.port}`);

    // Përpunimi i kërkesave të klientit
    handleClientRequest(server, msg, rinfo);
});

server.on('listening', () => {
    const address = server.address();
    console.log(`Serveri është i gatshëm të dëgjojë në ${address.address}:${address.port}`);
});

server.bind(PORT);

// Përpunimi i kërkesave të klientit
function handleClientRequest(server, message, clientInfo) {
    // Implementoni logjikën e kontrollit të aksesit dhe përgjigjen e kërkesave këtu
    // P.sh., mund të shikoni nëse kërkesa është për të lexuar, shkruar ose ekzekutuar,
    // dhe pastaj të lejoni ose mos lejoni bazuar në privilegjet e klientit.
    // Pastaj, përgjigjeni klientit në përputhje me rezultatin e kërkesës së tij.

    // Këtu është një shembull i thjeshtë për të dërguar një përgjigje tek klienti
    const response = 'Kërkesa u pranua dhe u përpunua me sukses.';
    server.send(response, clientInfo.port, clientInfo.address);
}
