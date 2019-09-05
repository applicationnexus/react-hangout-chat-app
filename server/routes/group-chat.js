const express = require('express');
const router = express.Router();
const GroupChatController = require('./controllers/group-chat.controller');
const GroupChat = new GroupChatController();
const response = require('../shared/response')

// Create group chat
router.post('/', async (req, res, next) => {
   const group = req.body.group;
   const groupResponse = await GroupChat.createGroupChat(group);
   response(res, groupResponse.status, groupResponse.results, groupResponse.message);
});

// Retrieve user groups
router.get('/retrieve', async (req, res, next) => {
   const userId = req.query.userId;
   const groupResponse = await GroupChat.retrieveUserGroups(userId);
   response(res, groupResponse.status, groupResponse.results, groupResponse.message);
});

// Retrieve group chat
router.get('/retrieve-group-chat', async (req, res, next) => {
   const groupId = req.query.groupId;
   const groupResponse = await GroupChat.retrieveGroupChat(groupId);
   response(res, groupResponse.status, groupResponse.results[0].messages, groupResponse.message);
})
module.exports = router;