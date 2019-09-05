const PrivateChatModel = require('../../mongo/model/private-chat');
const PrivateChat = new PrivateChatModel();
const SendResponseController = require('./send-response.controller');
const SendResponse = new SendResponseController();

class PrivateChatController {

   /**
    * Create chat for one to one communication
    * @param {Object} data
    */
   async createChat(data) {
      await PrivateChat.createChat(data).save()
      return SendResponse.sendResponse(200, "Chat created successfully", []);
   }

   /**
    * Save messages from one to one communication to chat schema
    * @param {Object} data
    */
   async saveMessages(data) {
      await PrivateChat.saveMessages(data)
      return SendResponse.sendResponse(200, "Message send", []);
   }

   /**
    * Retrieve chat
    * @param {Object} data
    */
   async retrieveChat(data) {
      const response = await PrivateChat.retrieveChat(data);
      if (response.length === 0) {
         return SendResponse.sendResponse(200, "No Chat found", []);
      } else {
         return SendResponse.sendResponse(200, "Chat fetched", response);
      }
   }
}

module.exports = PrivateChatController