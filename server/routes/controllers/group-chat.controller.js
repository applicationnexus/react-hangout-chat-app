const GroupChatModel = require('../../mongo/model/group-chat');
const GroupChat = new GroupChatModel();
const SendResponseController = require('./send-response.controller');
const SendResponse = new SendResponseController();

class GroupChatController {

   /**
    * Create group chat
    * @param {Object} group Object of user id's of members and group name
    */
   async createGroupChat(group) {
      await GroupChat.createGroup(group).save();
      const groupResponse = await GroupChat.getGroup(group)
      return SendResponse.sendResponse(200, 'Group Created Successfully', groupResponse)
   }

   /**
    * Retrieve user's group
    * @param {String} userId User id
    */
   async retrieveUserGroups(userId) {
      const groupResponse = await GroupChat.retrieveUserGroups(userId);
      if (groupResponse.length > 0) {
         const groups = [];
         for (let i = 0, len = groupResponse.length; i < len; i++) {

            const chatResponse = await GroupChat.retrieveMessages(groupResponse[i]._id)

            const data = {
               friend: {
                  _id: chatResponse[0]._id,
                  name: chatResponse[0].name,
                  groupCreatedAt: chatResponse[0].groupCreatedAt
               },
               members: chatResponse[0].members,
               messages: chatResponse[0].messages
            }
            groups.push(data);
         }
         return SendResponse.sendResponse(200, 'Groups retrieve Successfully', groups)
      } else {
         return SendResponse.sendResponse(400, 'No groups found', [])
      }
   }

   /**
    * Retrieve group's chat
    * @param {String} groupId Group id
    */
   async retrieveGroupChat(groupId) {
      const groupChat = await GroupChat.retrieveGroupChat(groupId);
      return SendResponse.sendResponse(200, 'Chat retrieved successfully', groupChat);
   }

   /**
    * Save messages from group communication to groupChat schema
    * @param {Object} data
    */
   async saveMessages(data) {
      await GroupChat.saveMessages(data);
      return SendResponse.sendResponse(200, 'Message send', [])
   }
}

module.exports = GroupChatController