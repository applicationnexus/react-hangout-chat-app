const UserModel = require('../../mongo/model/user');
const User = new UserModel();
const SendResponseController = require('./send-response.controller');
const SendResponse = new SendResponseController();

class UserController {
   /**
    * Check if user exists or not using his email id
    * @param {String} email
    */
   async checkUserExistenceByEmail(email) {
      return await User.checkExistingUserByEmail(email)
   }

   /**
    * Check if user exists or not by using his google id
    * @param {String} userId
    * @param {Object} data
    */
   async checkExistingUserByGoogleId(userId, data) {
      try {
         const results = await User.checkExistingUserByGoogleId(userId);
         //If user is already present send the user's data
         if (results != null) {
            return SendResponse.sendResponse(200, "User already exist", results)
         } else {
            //If user is not present create one
            const userResponse = await User.addUser(data).save();
            return SendResponse.sendResponse(200, "User created successfully", userResponse)
         }
      } catch (e) {
         console.log("e", e);
         return {
            status: 400,
            results: [],
            message: "Error creating user"
         }
      }
   }

   /**
    * Add user's online/offline status
    * @param {String} userId
    * @param {Boolean} status
    */
   async addUserStatus(userId, status) {
      await User.addUserStatus(userId, status)
      await User.addStatusInFriendsList(userId, status)
   }

   /**
    * Retrieve user details
    * @param {String} userId
    */
   async retrieveUser(userId) {
      return await User.retrieveFriends(userId);
   }
}

module.exports = UserController;