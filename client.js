const dgram = require('dgram');

// Set server IP address and server socket port number
const serverName = 'localhost'; // Could be IP address or host name of the server (website)
const serverPort = 1234; // integer

// Create client socket
const clientSocket = dgram.createSocket('udp4'); // IPv4, UDP socket

// Creating message
const message = 'Enter lower case sentence: ';

// Send the message
clientSocket.send(message, serverPort, serverName, (err) => {
    if (err) {
        console.error('Error sending message to server:', err);
        clientSocket.close();
    } else {
        console.log(`Message sent to server at ${serverName}:${serverPort}`);
    }
});

// Wait for receiving reply from Server
clientSocket.on('message', (modifiedMessage, serverAddress) => {
    console.log('Modified Message:', modifiedMessage.toString());
    console.log('Server Address:', serverAddress);
    
    // Close client socket after receiving the response
    clientSocket.close();
});

// Handle errors
clientSocket.on('error', (err) => {
    console.error('Client error:', err);
});

// Handle socket close
clientSocket.on('close', () => {
    console.log('Client socket is closed.');
});