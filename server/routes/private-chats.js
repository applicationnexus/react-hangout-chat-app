const express = require('express');
const router = express.Router();
const PrivateChatController = require('./controllers/private-chats.controller')
const PrivateChat = new PrivateChatController();
const response = require('../shared/response')

// Add chat schema
router.post('/', async (req, res, next) => {
   const data = {
      requesterId: req.query.requesterId,
      recipientId: req.query.recipientId
   }
   const chatResponse = await PrivateChat.createChat(data)
   response(res, chatResponse.status, [], chatResponse.message);
});


// Retrieve chat
router.get('/retrieve', async (req, res, next) => {
   const data = {
      friend1: req.query.friend1,
      friend2: req.query.friend2
   }
   const chatResponse = await PrivateChat.retrieveChat(data)
   response(res, chatResponse.status, chatResponse.results, chatResponse.message);
})

module.exports = router;