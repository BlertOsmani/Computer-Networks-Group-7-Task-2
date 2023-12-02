const dgram = require('dgram');
const fs = require('fs');

const PORT = 3000;
const IP_ADDRESS = '192.168.1.69';

let adminClient = null;

const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
  const clientKey = `${rinfo.address}:${rinfo.port}`;

  console.log(`Message received from client ${rinfo.address} ${rinfo.port} : ${msg}`);

  if (!adminClient) {
    adminClient = clientKey;
    server.send('You are admin', rinfo.port, rinfo.address);
  } else if (adminClient !== clientKey) {
    server.send('You don\'t have admin permissions', rinfo.port, rinfo.address);
  }

  const message = msg.toString().trim();

  const commandMatch = message.match(/^(\w+)\s+([^\s]+)(?:\s+(.*))?$/);

  if (commandMatch) {
    const [, command, path, content] = commandMatch;
    switch (command) {
      case 'read':
        handleRead(rinfo, path);
        break;
      case 'write':
        if (clientKey === adminClient) {
          handleWrite(rinfo, path, content);
        } else {
          server.send('!write', rinfo.port, rinfo.address);
        }
        break;
      case 'delete':
        if (clientKey === adminClient) {
          handleDelete(rinfo, path, content);
        } else {
          server.send('!delete', rinfo.port, rinfo.address);
        }
        break;
        case 'upload':
          if (clientKey === adminClient) {
            handleUpload(rinfo, path, content);
          } else {
            server.send('!upload', rinfo.port, rinfo.address);
          }
          break;
      default:
        server.send('Invalid command', rinfo.port, rinfo.address);
        break;
    }
  }
});

function handleUpload(clientInfo, path, message) {
  const sanitizedMessage = message.replace(/"/g, '');

  fs.writeFile(path, sanitizedMessage, 'utf8', (err) => {
    if (err) {
      server.send(`Error uploading file: ${err.message}`, clientInfo.port, clientInfo.address);
    } else {
      server.send('File uploaded successfully', clientInfo.port, clientInfo.address);
    }
  });
}

function handleDelete(clientInfo, path) {
  fs.unlink(path, (err) => {
    if (err) {
      server.send(`Error deleting file: ${err.message}`, clientInfo.port, clientInfo.address);
    } else {
      server.send('File deleted successfully', clientInfo.port, clientInfo.address);
    }
  });
}

server.on('listening', () => {
  const address = server.address();
  console.log(`Server listening on ${address.address}:${address.port}`);
});

server.bind(PORT, IP_ADDRESS);

function handleRead(clientInfo, path) {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      server.send(`Error reading file: ${err.message}`, clientInfo.port, clientInfo.address);
    } else {
      server.send(`File content:${data}`, clientInfo.port, clientInfo.address);
    }
  });
}


function handleWrite(clientInfo, path, message) {
    const sanitizedMessage = message.replace(/"/g, '');
  
    fs.readFile(path, 'utf8', (err, existingContent) => {
      if (err) {
        server.send(`Error reading file: ${err.message}`, clientInfo.port, clientInfo.address);
      } else {
        server.send('Do you want to rewrite the content or add to it? (rewrite/add): ', clientInfo.port, clientInfo.address);
          server.once('message', (choiceMsg, choiceRinfo) => {
          const writeOption = choiceMsg.toString().trim().toLowerCase();
  
          const writeMode = writeOption === 'rewrite' ? 'w' : 'a';
          const newContent = writeMode === 'a' ? existingContent + '\n' + sanitizedMessage : sanitizedMessage;
  
          fs.writeFile(path, newContent, 'utf8', (err) => {
            if (err) {
              server.send(`Error writing to file: ${err.message}`, clientInfo.port, clientInfo.address);
            } else {
              server.send('Write to file successful', clientInfo.port, clientInfo.address);
            }
          });
        });
      }
    });
  }
