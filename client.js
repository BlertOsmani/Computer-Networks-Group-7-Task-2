const dgram = require('dgram');

// Set server IP address and server socket port number
const serverName = '10.11.65.138'; // Could be IP address or host name of the server (website)
const serverPort = 1234; // integer

// Create client socket
const clientSocket = dgram.createSocket('udp4'); // IPv4, UDP socket

// Function to send a message to the server
function sendMessage() {
    // Read user input from the console
    process.stdout.write('Enter a message: ');
    process.stdin.once('data', (input) => {
        const message = input.toString().trim();

        // Send the message to the server
        clientSocket.send(message, serverPort, serverName, (err) => {
            if (err) {
                console.error('Error sending message to server:', err);
                clientSocket.close();
            } else {
                console.log(`Message sent to server at ${serverName}:${serverPort}`);
            }
        });
    });
}

// Wait for receiving reply from Server
clientSocket.on('message', (modifiedMessage, serverAddress) => {
    console.log('Modified Message:', modifiedMessage.toString());
    console.log('Server Address:', serverAddress);

    // Prompt user for the next message
    sendMessage();
});

// Handle errors
clientSocket.on('error', (err) => {
    console.error('Client error:', err);
});

// Handle socket close
clientSocket.on('close', () => {
    console.log('Client socket is closed.');
});

// Start by sending the first message
sendMessage();