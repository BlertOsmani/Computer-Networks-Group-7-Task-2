const dgram = require('dgram');

// Create server
const serverName = 'localhost';
const serverPort = 1234;

// Create server socket
const serverAddress = { address: serverName, port: serverPort };
const serverSocket = dgram.createSocket('udp4'); // IPv4, UDP socket

// Associate server port number with the socket
serverSocket.bind(serverAddress.port, serverAddress.address);

console.log('The server is ready to receive');

// For continuous receival of messages
serverSocket.on('message', (message, clientAddress) => {
    console.log(`Received message from client at ${clientAddress.address}:${clientAddress.port}`);
    console.log(`Original message: ${message.toString()}`);

    const modifiedMessage = message.toString().toUpperCase(); // Capitalize the message
    serverSocket.send(modifiedMessage, clientAddress.port, clientAddress.address, (err) => {
        if (err) {
            console.error('Error sending response to client:', err);
        } else {
            console.log('Response sent to client:', modifiedMessage);
        }
    });
});

// Handle errors
serverSocket.on('error', (err) => {
    console.error('Server error:', err);
});

// Handle server close
serverSocket.on('close', () => {
    console.log('Server is closing.');
});

// Handle server listening
serverSocket.on('listening', () => {
    const address = serverSocket.address();
    console.log(`Server is listening on ${address.address}:${address.port}`);
});

// For continuous receival of messages
// While loop is not needed in Node.js as the server continuously listens for messages
// The serverSocket.on('message') event is triggered whenever a message is received
