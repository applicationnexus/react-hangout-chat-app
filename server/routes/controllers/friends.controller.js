const UserController = require('../../mongo/model/user');
const User = new UserController();
const PrivateChatController = require('../../mongo/model/private-chat');
const PrivateChat = new PrivateChatController();
const SendResponseController = require('./send-response.controller');
const SendResponse = new SendResponseController();

class FriendsController {

   /**
    * Add friends to requested user's list as well as recipient user's list
    * @param {Object} requester
    * @param {Object} recipient
    */
   async addFriend(requester, recipient) {
      await this.addFriendToRequester(requester);
      await this.addFriendToRecipient(recipient);
      return SendResponse.sendResponse(200, "Friends added successfully", []);
   }

   /**
    * Add friends to requested user's list
    * @param {Object} requester
    */
   async addFriendToRequester(requester) {
      return await User.addFriends(requester);
   }

   /**
    * Add friends to recipient user's list
    * @param {Object} recipient
    */
   async addFriendToRecipient(recipient) {
      return await User.addFriends(recipient);
   }

   /**
    * Retrieve friends of requested user
    * @param {String} userId
    */
   async retrieveFriends(userId) {
      const response = await User.retrieveFriends(userId);

      if (response !== null || response.friends.length > 0) {
         const friends = [];
         for (let i = 0, len = response.friends.length; i < len; i++) {
            const friendsIdData = {
               friend1: userId,
               friend2: response.friends[i].id
            }
            const chatResponse = await PrivateChat.retrieveMessages(friendsIdData)

            const data = {
               friend: response.friends[i],
               members: chatResponse[0].members,
               messages: chatResponse[0].messages
            }
            friends.push(data);
         }
         return SendResponse.sendResponse(200, "Fetched friends successfully", friends);
      } else {
         return SendResponse.sendResponse(400, "No friends found", response.friends);
      }

   }
}

module.exports = FriendsController