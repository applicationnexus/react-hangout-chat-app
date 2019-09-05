const PrivateChatController = require('./routes/controllers/private-chats.controller')
const PrivateChat = new PrivateChatController();
const UserController = require('./routes/controllers/user.controller');
const User = new UserController();
const GroupChatController = require('./routes/controllers/group-chat.controller')
const GroupChat = new GroupChatController();

class SocketController {

   /**
    * Initalize Socket and connection listener
    * @param {SocketIOClientStatic} io - Instance of socket.io server
    */
   constructor(io) {
      this.io = io;
      this.io.on('connection', (socket) => {
         this.connected(socket);
         socket.on('userConnected', async (results, err) => {
            socket.join(results);
            this.addUserStatus(results, true);
         });
         socket.on('userDisconnected', async (results, err) => {
            socket.leave(results);
            this.addUserStatus(results, false);
         });
         socket.on('groupConnected', async (results, err) => {
            socket.join(results);
         })
      });
   }

   /**
    * Add user's online/offline status
    * @param {String} userId
    * @param {Boolean} status
    */
   async addUserStatus(userId, status) {
      await User.addUserStatus(userId, status);
   }

   /**
    * Client connection
    * @param {SocketIO.Socket} socket - Socket instance
    */
   connected(socket) {
      this.socket = socket;
      //remove all previously register listeners
      this.socket.removeAllListeners();
      this.emitPrivateMessages();
      this.emitGroupChatMessages();
   }

   /**
    * Get group chat messages, save it to schema and then emit them to group
    */
   async emitGroupChatMessages() {
      this.socket.on('group-message', async (results, err) => {
         GroupChat.saveMessages(results);
         const emitResult = this.createResultsObject(results, await this.getUser(results.from), 'group')
         this.io.sockets.to(results.to).emit('group-message', emitResult);
      });
   }

   /**
    * Retrieve user details
    * @param {String} userId
    */
   async getUser(userId) {
      return await User.retrieveUser(userId);
   }

   /**
    * Emit private chat messages to user's
    */
   async emitPrivateMessages() {
      this.socket.on('private-message', async (results, err) => {
         await PrivateChat.saveMessages(results);
         const emitResult = this.createResultsObject(results, await this.getUser(results.from), 'private')
         this.io.sockets.to(results.to).emit('private-message', emitResult);
      });
   }

   /**
    * Create object to emit to match the format of server response(when extracting chat history)
    * @param {Object} results
    * @param {Object} from
    */
   createResultsObject(results, from, type) {
      if (type === 'group') {
         return {
            to: results.to,
            messages: {
               from: from,
               message: results.messages.message
            }
         }
      } else {
         return {
            messages: {
               from: from,
               message: results.messages.message
            }
         }
      }

   }
}

module.exports = SocketController;