const app = require('./default-settings');
const ServerController = require('./server');
const mongoDB = require('./mongo/connect')
const SocketController = require('./socket');

//Initialize mongoDb database connection
new mongoDB().connect()

//Initialize server connection
const serverInstance = new ServerController(app);
const server = serverInstance.getServer();

//Initialize socket connection
new SocketController(require('socket.io')(server));

module.exports = app;