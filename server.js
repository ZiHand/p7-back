const http    = require('http');
const app     = require('./js/app');

// =============================================
//  normalizePort
// =============================================
const normalizePort = val => 
{
    const port = parseInt(val, 10);
  
    if (isNaN(port)) 
    {
      return val;
    }
    if (port >= 0) 
    {
      return port;
    }

    return false;
};

// =============================================
//  Handle Errors
// =============================================
const errorHandler = error => 
{
    if (error.syscall !== 'listen') 
    {
      throw error;
    }
  
    const address = server.address();
  
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) 
    {
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

// =============================================
//  Compute port & set it
// =============================================
const port = normalizePort(process.env.PORT);
app.set('port', port);

// =============================================
//  Server Creation
// =============================================
const server = http.createServer(app);

// =============================================
//  Attach Server Events
// =============================================
server.on('error', errorHandler);
server.on('listening', () => 
{
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// =============================================
//  Server Start Listening
// =============================================
server.listen(port);