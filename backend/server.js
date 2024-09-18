// Import du module HTTP de Node.js pour créer un serveur
const http = require('http');
// Import de l'app express
const app = require('./app');

// Fonction pour normaliser le port en un entier, une chaîne, ou false
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
const port = normalizePort(process.env.PORT ||'4000');
app.set('port', port);

// Gestionnaire d'erreurs pour le serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.'); // Le port ou la pipe nécessite des privilèges élevés
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.'); // Le port ou la pipe est déjà utilisé
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Création du serveur HTTP en utilisant l'application comme gestionnaire des requêtes
const server = http.createServer(app);
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});
// Le serveur commence à écouter sur le port défini
server.listen(port);