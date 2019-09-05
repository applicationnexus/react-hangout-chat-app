const http = require('http')
const debug = require('debug')('react-server:server')

class ServerController {
   constructor(app) {
      this.server = http.createServer(app)
      this.createServer(app);
   }

   /**
    * Create HTTP server.
    */
   createServer(app) {
      /**
       * Normalize a port into a number, string, or false.
       */
      const port = this.normalizePort(process.env.PORT || '4001')
      app.set('port', port)

      /**
       * Listen on provided port, on all network interfaces.
       */
      this.server.listen(port, '127.0.0.1')
      this.server.on('error', this.onError)

      this.server.on('listening', () => {
         /**
          * Event listener for HTTP server "listening" event.
          */
         const addr = this.server.address();
         const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
         debug('Listening on ' + bind)
      })
   }

   getServer() {
      return this.server;
   }

   /**
    * Normalize a port into a number, string, or false.
    */
   normalizePort(val) {
      const port = parseInt(val, 10)

      if (isNaN(port)) {
         // named pipe
         return val
      }

      if (port >= 0) {
         // port number
         return port
      }

      return false
   }

   /**
    * Event listener for HTTP server "error" event.
    */
   onError(error) {
      if (error.syscall !== 'listen') {
         throw error
      }

      const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

      // handle specific listen errors with friendly messages
      switch (error.code) {
         case 'EACCES':
            console.error(bind + ' requires elevated privileges')
            process.exit(1)
            break
         case 'EADDRINUSE':
            console.error(bind + ' is already in use')
            process.exit(1)
            break
         default:
            throw error
      }
   }
}

module.exports = ServerController;