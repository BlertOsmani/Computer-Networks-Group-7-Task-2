const dgram = require('dgram');

// Create server
const serverName = '10.11.68.62';
const serverPort = 1234;

// Create server socket
const serverAddress = { address: serverName, port: serverPort };
const serverSocket = dgram.createSocket('udp4'); // IPv4, UDP socket

// Associate server port number with the socket
serverSocket.bind(serverAddress.port, serverAddress.address);

console.log('The server is ready to receive');

// Function to handle incoming messages and send a dynamic response
function handleIncomingMessage(message, clientAddress) {
    console.log(`Received message from client at ${clientAddress.address}:${clientAddress.port}`);
    console.log(`Original message: ${message.toString()}`);

    // Read input from the console for the dynamic response
    process.stdout.write('Enter a response: ');
    process.stdin.once('data', (input) => {
        const responseMessage = input.toString().trim();

        // Send the dynamic response to the client
        serverSocket.send(responseMessage, clientAddress.port, clientAddress.address, (err) => {
            if (err) {
                console.error('Error sending response to client:', err);
            } else {
                console.log('Response sent to client:', responseMessage);
            }
        });
    });
}

// Event handler for continuous receival of messages
serverSocket.on('message', handleIncomingMessage);

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
// The serverSocket.on('message') event is triggered whenever a message is received.