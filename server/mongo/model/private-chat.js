const schema = require('../schema/private-chats')

class Chat {

   /**
    * Add chat data
    * @param {Object} data Member id's
    */
   createChat(data) {
      return new schema.chats({
         members: [data.requesterId, data.recipientId],
      });
   }

   /**
    * Save chats by finding the respective members chat
    * @param {Object} data Member id's and messages
    */
   async saveMessages(data) {
      const members = data.members;
      const messages = data.messages;

      return await schema.chats.updateOne({
         $or: [{
            members: [members[0], members[1]]
         }, {
            members: [members[1], members[0]]
         }]
      }, {
         $push: {
            messages: {
               from: messages.from,
               message: messages.message
            }
         }
      })
   }

   /**
    * Retrieve last messages from the chat of respective users
    * @param {Object} data Member id's
    */
   retrieveMessages(data) {
      return schema.chats.find({
         $or: [{
            members: [data.friend2, data.friend1]
         }, {
            members: [data.friend1, data.friend2]
         }]
      }).populate('messages.from')
   }
}

module.exports = Chat;