const schema = require('../schema/invite')
const mongo = require('mongodb');

class Invite {

   /**
    * Add invite request data
    * @param {Object} data Member id's
    */
   addInviteRequest(data) {
      return new schema.invites({
         to: data.to,
         from: data.from,
         status: 'pending'
      });
   }

   /**
    * Delete invite request once user accept the invitation
    * @param {String} requestId
    */
   deleteInviteRequest(requestId) {
      return schema.invites.deleteOne({
         _id: new mongo.ObjectId(requestId),
      });
   }

   /**
    * Check user invite request if exists or not
    * @param {String} to Email of receiver
    * @param {String} from Email of sender
    * @param {String} status Status of request pending/rejected
    */
   checkInviteRequest(to, from, status) {
      return schema.invites.findOne({
         to: to,
         from: from,
         status: status
      })
   }

   /**
    * Get the invitations of the email address
    * @param {String} email
    */
   retrieveInvitations(email) {
      return schema.invites.find({
         to: email,
         status: 'pending'
      }).populate('from')
   }

   /**
    * Reject invite request by making the status field as rejected
    * @param {String} requestId
    */
   rejectInviteRequest(requestId) {
      return schema.invites.updateOne({
         _id: new mongo.ObjectId(requestId),
      }, {
         $set: {
            status: 'rejected'
         }
      })
   }

   /**
    * Get send invitations which are pending/rejected
    * @param {String} userId
    */
   getSendInvitations(userId) {
      return schema.invites.find({
         from: userId
      })
   }
}

module.exports = Invite;