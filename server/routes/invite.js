const express = require('express');
const router = express.Router();
const response = require('../shared/response');
const InviteController = require('./controllers/invite.controller')
const Invite = new InviteController();

//Add invitations
router.post('/', async (req, res, next) => {
   try {
      const toEmail = req.body.to;
      const fromEmail = req.body.from;
      const senderName = req.body.senderName;
      //Check if user had already logged in or not
      const inviteResponse = await Invite.checkInviteRequest(toEmail, fromEmail, senderName);
      response(res, inviteResponse.status, [], inviteResponse.message);
   } catch (e) {
      console.log("e", e);
   }
});

//Retrieve invitations
router.get('/retrieve', async (req, res, next) => {
   const email = req.query.email;
   const invitations = await Invite.retrieveInvitations(email);
   response(res, invitations.status, invitations.results, invitations.message);
})

//Accept invitation
router.post('/accept', async (req, res, next) => {
   const requestId = req.body.requestId;
   const invitation = await Invite.acceptInvitation(requestId);
   response(res, invitation.status, [], invitation.message);
})

//Reject invitation
router.post('/reject', async (req, res, next) => {
   const requestId = req.body.requestId;
   const invitation = await Invite.rejectInvitation(requestId);
   response(res, invitation.status, [], invitation.message);
})

//Get send invitations which are pending/rejected.
router.get('/get-send-invitations', async (req, res, next) => {
   const userId = req.query.userId;
   const invitations = await Invite.getSendInvitations(userId);
   response(res, invitations.status, invitations.results, invitations.message);
})

module.exports = router;