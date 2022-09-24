// Importing the Node HTTP package.js
const http = require('http');

// Importing  app.js
const app = require('./app');

// A function that returns a valid port, whether provided as a number or a string
const normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Setting the port with the Express set method
const port = normalizePort(process.env.PORT ||'3000');
// app uses the normalised port
app.set('port', port);

// Function that looks for different errors and handles them appropriately
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// Port you want to listen to, if the port is not available => default port 3000
server.listen(port);
