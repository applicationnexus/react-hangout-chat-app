const express = require('express');
const router = express.Router();
const FriendController = require('../routes/controllers/friends.controller')
const Friend = new FriendController();
const response = require('../shared/response')

// Add friend
router.post('/', async (req, res, next) => {
   const requester = req.body.requester
   const recipient = req.body.recipient
   const friendResponse = await Friend.addFriend(requester, recipient)
   response(res, friendResponse.status, [], friendResponse.message);
});

// Retrieve friends
router.get('/retrieve', async (req, res, next) => {
   const userId = req.query.userId;
   const friendResponse = await Friend.retrieveFriends(userId);
   response(res, friendResponse.status, friendResponse.results, friendResponse.message)
});
module.exports = router;