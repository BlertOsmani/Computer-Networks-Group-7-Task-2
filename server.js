const dgram = require('dgram');
const fs = require('fs');

const PORT = 3000;
const IP_ADDRESS = '192.168.43.251';

let adminClient = null;

const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
  const clientKey = `${rinfo.address}:${rinfo.port}`;

  console.log(`Message received from client ${rinfo.address} ${rinfo.port} : ${msg}`);

  if (!adminClient) {
    adminClient = clientKey;
    server.send('You are the admin', rinfo.port, rinfo.address);
  } else if (adminClient !== clientKey) {
    server.send('You do not have admin permissions', rinfo.port, rinfo.address);
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
          server.send('You do not have write permissions', rinfo.port, rinfo.address);
        }
        break;
      case 'execute':
        handleExecute(rinfo, path);
        break;
      case 'delete':
        handleDelete(rinfo, path);
        break;
        case 'upload':
          if (clientKey === adminClient) {
            handleUpload(rinfo, path, content);
          } else {
            server.send('You do not have upload permissions', rinfo.port, rinfo.address);
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
