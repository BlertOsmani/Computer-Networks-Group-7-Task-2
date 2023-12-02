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
    

function promptOptions() {
  rl.question('Choose an option (read/write/delete/upload/exit): ', (option) => {
    if (option.toLowerCase() === 'read') {
      rl.question('Enter the file path to read: ', (filePath) => {
        const readCommand = `read ${filePath}`;
        client.send(readCommand, PORT, IP_ADDRESS);
      });
    } else if (option.toLowerCase() === 'write') {
      rl.question('Enter the file path to write: ', (filePath) => {
        rl.question('Enter the content to write: ', (content) => {
          const writeCommand = `write ${filePath} "${content}"`;
          client.send(writeCommand, PORT, IP_ADDRESS);
        });});
    } else if (option.toLowerCase() === 'delete') {
      rl.question('Enter the file path to delete: ', (filePath) => {
        const deleteCommand = `delete ${filePath}`;
        client.send(deleteCommand, PORT, IP_ADDRESS);
      });
    } else if (option.toLowerCase() === 'upload') {
      rl.question('Enter the file path to upload: ', (filePath) => {
        rl.question('Enter the content to upload: ', (content) => {
          const uploadCommand = `upload ${filePath} "${content}"`;
          client.send(uploadCommand, PORT, IP_ADDRESS);
        });
      });
    } else if (option.toLowerCase() === 'exit') {
      client.send('exit', PORT, IP_ADDRESS);
          client.close();
          rl.close();
          return;
    } else {
      console.log('Invalid option');
      promptOptions();
    }
  });
}


    promptOptions();
  });
}

startClient();
