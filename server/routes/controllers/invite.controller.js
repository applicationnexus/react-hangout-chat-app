const nodemailer = require("nodemailer");
const InviteSchema = require('../../mongo/model/invite');
const Invite = new InviteSchema();
const UserController = require("../controllers/user.controller");
const user = new UserController();
const SendResponseController = require('./send-response.controller');
const SendResponse = new SendResponseController();

class InviteController {
   /**
    * Check user existence, if exist then add invitation request, if not exist then send mail to user.
    * @param {String} toEmail Email for which invitation has to be sent
    * @param {String} fromEmail Email from which invitation will be sent
    * @param {String} senderName Sender name
    */
   async checkUserExistence(toEmail, fromEmail, senderName) {
      const userExist = await user.checkUserExistenceByEmail(toEmail);
      if (userExist !== null) {
         await this.addInviteRequest(toEmail, fromEmail);

         return SendResponse.sendResponse(200, "Invitation send successfully", [])
      } else {
         await this.sendInviteMail(toEmail, fromEmail, senderName);
         return SendResponse.sendResponse(200, "Invitation send successfully", [])
      }
   }

   /**
    * Configure node-mailer options and transport object
    * @param {String} toEmail Receiver email
    * @param {String} senderName Sender's name
    */
   configureNodeMailerOptions(toEmail, senderName) {
      // create reusable transporter object using the default transport
      let transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: {
            user: 'sanjivani.g@applicationnexus.com',
            pass: 'Sanju1703'
         }
      });

      // setup email data with unicode symbols
      let mailOptions = {
         from: '<sanjivani.g@applicationnexus.com>', // sender address
         to: toEmail, // receiver
         subject: 'Invitation', // Subject line
         text: 'Invitation', // plain text body
         html: `<p>Hello,</p><p><span style='color:#0f9d58'>${senderName}</span> has invited you to have a conversation.</p><p>Please accept the invitation by clicking below <a href='http://localhost:3000' style='color:#0f9d58;font-size:1.3em'>Accept Invitation</a></p>` // html body
      };

      const options = {
         transporter: transporter,
         mailOptions: mailOptions
      }
      return options;
   }

   /**
    * Send invitation email to user using node-mailer
    * @param {String} toEmail Receiver email
    * @param {String} fromEmail sender email
    * @param {String} senderName sender's name
    */
   async sendInviteMail(toEmail, fromEmail, senderName) {
      const options = this.configureNodeMailerOptions(toEmail, senderName);

      // send mail with defined transport object
      options.transporter.sendMail(options.mailOptions, async (error, info) => {
         if (error) {
            return console.log("sendMail error", error);
         }
         console.log('Message sent: %s', info.messageId);
         await this.addInviteRequest(toEmail, fromEmail);
      });
   }

   /**
    * Add invite request
    * @param {String} toEmail
    * @param {String} fromEmail
    */
   async addInviteRequest(toEmail, fromEmail) {
      try {
         const data = {
            to: toEmail,
            from: fromEmail
         }

         await Invite.addInviteRequest(data).save();
      } catch (e) {
         console.log("e", e);
      }
   }

   /**
    * Check rejected request, if exist send response of rejection.
    * If rejected request not exist, then check pending request, if exist send response of request pending.
    * If pending request not exist then check user existence(registered).
    * If user exist, then ask requested user to send invitation from app side else send mail for invitation.
    * @param {String} toEmail Receiver's email
    * @param {String} fromEmail Sender's email
    * @param {String} senderName Sender's name
    */
   async checkInviteRequest(toEmail, fromEmail, senderName) {
      //Check if invite request is rejected
      const rejectedRequest = await Invite.checkInviteRequest(toEmail, fromEmail, 'rejected');
      if (rejectedRequest == null) {
         //Check if invite request is pending
         const pendingRequest = await Invite.checkInviteRequest(toEmail, fromEmail, 'pending');
         if (pendingRequest !== null) {
            //If request is not pending nor rejected, send response
            return SendResponse.sendResponse(200, "Your invitation is still pending", [])
         } else {
            //Check if user exists or not
            return await this.checkUserExistence(toEmail, fromEmail, senderName)
         }
      } else {
         //If invitation is rejected, send response of rejection
         return SendResponse.sendResponse(400, "You can't send invitation to this user", [])
      }
   }

   /**
    * Retrieve pending invitations of the respected email address
    * @param {String} email
    */
   async retrieveInvitations(email) {
      const invitations = await Invite.retrieveInvitations(email);
      if (invitations !== null) {
         return SendResponse.sendResponse(200, "Fetched invitations", invitations)
      } else {
         return SendResponse.sendResponse(400, "No invitations found", [])
      }
   }

   /**
    * User accepted the invitation so remove the invitation from invite list
    * @param {String} requestId
    */
   async acceptInvitation(requestId) {
      try {
         const deletedUser = await Invite.deleteInviteRequest(requestId);
         if (deletedUser.deletedCount == 1) {
            return SendResponse.sendResponse(200, 'Invite Request deleted Successfully', [])
         } else {
            return SendResponse.sendResponse(400, 'Error deleting invite request', [])
         }
      } catch (e) {
         return SendResponse.sendResponse(400, 'Error deleting invite request', [])
      }
   }

   /**
    * User rejected the invitation so, make the invite status as rejected so he can't make any further request
    * @param {String} requestId
    */
   async rejectInvitation(requestId) {
      try {
         const rejectInvite = await Invite.rejectInviteRequest(requestId);
         if (rejectInvite.ok === 1) {
            return SendResponse.sendResponse(200, 'Invite Request rejected', [])
         }
      } catch (e) {
         return SendResponse.sendResponse(200, 'Error rejecting invite request', [])
      }
   }

   /**
    * Get send invitations which are pending or rejected
    * @param {String} userId User id
    */
   async getSendInvitations(userId) {
      const data = await Invite.getSendInvitations(userId);

      const invitations = [];
      if (data !== null) {
         for (let i = 0, len = data.length; i < len; i++) {
            const userResponse = await user.checkUserExistenceByEmail(data[i].to);
            if (userResponse !== null) {
               const formattedRequest = await this.createFormat(data[i], userResponse);
               invitations.push(formattedRequest);
            }
         }

         return SendResponse.sendResponse(200, 'Invitations retrieved', invitations);
      } else {
         return SendResponse.sendResponse(400, 'No invitations found', []);
      }
   }

   /**
    * Create object format
    * @param {Object} data
    * @param {Object} fromObj
    */
   async createFormat(data, fromObj) {
      return {
         to: data.to,
         from: fromObj,
         status: data.status
      }
   }
}

module.exports = InviteController;