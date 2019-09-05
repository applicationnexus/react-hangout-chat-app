const schema = require('../schema/group-chat')
const mongo = require('mongodb');

class GroupChat {

   /**
    * Create group
    * @param {Object} group Object of member id's and group name
    */
   createGroup(group) {
      return new schema.groupChats({
         members: group.members,
         name: group.name
      });
   }

   /**
    * Get the group using its members
    * @param {Object} group Object of member id's and group name
    */
   getGroup(group) {
      return schema.groupChats.findOne({
         members: group.members
      })
   }

   /**
    * Retrieve user's group
    * @param {String} userId
    */
   retrieveUserGroups(userId) {
      return schema.groupChats.find({
         members: userId
      });
   }

   /**
    * Retrieve last messages of group chat
    * @param {String} groupId Group Id
    */
   retrieveMessages(groupId) {
      return schema.groupChats.find({
         _id: new mongo.ObjectId(groupId)
      }).populate('messages.from')
   }

   /**
    * Save group chats by finding the respective group id
    * @param {Object} data
    */
   async saveMessages(data) {
      return await schema.groupChats.updateOne({
         _id: new mongo.ObjectId(data.to)
      }, {
         $push: {
            messages: {
               from: data.messages.from,
               message: data.messages.message
            }
         }
      })
   }
}

module.exports = GroupChat;