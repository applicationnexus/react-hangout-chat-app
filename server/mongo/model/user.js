const schema = require('../schema/user')
const mongo = require('mongodb');

class User {
   /**
    * Add user
    * @param {Object} data User data
    */
   addUser(data) {
      return new schema.user({
         user_id: data.googleId,
         name: data.name,
         email: data.email,
         picture: data.imageUrl,
         givenName: data.givenName,
         familyName: data.familyName
      });
   }

   /**
    * Check user logged in with userId
    * @param {Number} userId
    */
   checkExistingUserByGoogleId(userId) {
      return schema.user.findOne({
         user_id: userId
      })
   }

   /**
    * Check user logged in with email
    * @param {String} email
    */
   checkExistingUserByEmail(email) {
      return schema.user.findOne({
         email: email
      })
   }

   /**
    * Add friend to user's schema
    * @param {Object} data
    */
   addFriends(data) {
      return schema.user.updateOne({
         _id: new mongo.ObjectId(data.id),
      }, {
         $push: {
            friends: {
               id: data.friend_id,
               name: data.name,
               email: data.email,
               picture: data.picture,
               status: false
            }
         }
      })
   }

   /**
    * Get friends of the specified user id.
    * @param {String} userId
    */
   retrieveFriends(userId) {
      return schema.user.findOne({
         _id: new mongo.ObjectId(userId)
      })
   }

   /**
    * Add user's online/offline status
    * @param {String} userId
    */
   async addUserStatus(userId, status) {
      await schema.user.updateOne({
         _id: new mongo.ObjectId(userId)
      }, {
         online: status
      })
   }

   /**
    * Add user status in friends list
    * @param {String} userId
    * @param {Boolean} status
    */
   async addStatusInFriendsList(userId, status) {
      await schema.user.updateMany({
         "friends.id": userId
      }, {
         $set: {
            "friends.$.status": status
         }
      }, {
         upsert: false
      })
   }
}

module.exports = User;