const dgram = require('dgram');
const readline = require('readline');

const PORT = 3000;
let IP_ADDRESS;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function startClient() {
  const client = dgram.createSocket('udp4');

  rl.question('Enter the server IP address: ', (address) => {
    IP_ADDRESS = address;

    client.on('message', (msg) => {
      const response = msg.toString();

      if (response.startsWith('File content:')) {
        const fileContent = response.substring('File content:'.length);
        console.log('File content:\n', fileContent);

        promptOptions();
      } else if (response === 'Do you want to rewrite the content or add to it? (rewrite/add): ') {
        rl.question('Enter your choice (rewrite/add): ', (writeOption) => {
          const choiceCommand = `${writeOption.toLowerCase()}`;
          client.send(choiceCommand, PORT, IP_ADDRESS);
        });
      } else {
        console.log('Server response:', response);
        promptOptions();
      }
    });

    client.on('close', () => {
      console.log('Disconnected from server');
      rl.close();
    });

    client.on('error', (err) => {
      console.error('Error occurred:', err.message);
      client.close();
      rl.close();
    });

    client.send('Connected', PORT, IP_ADDRESS);
