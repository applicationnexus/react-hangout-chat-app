const express = require('express');
const router = express.Router();
const response = require('../shared/response');
const UserController = require('../routes/controllers/user.controller');
const User = new UserController();

//Check user existence
router.post('/', async (req, res, next) => {
   try {
      const userId = req.body.googleId;
      const results = await User.checkExistingUserByGoogleId(userId, req.body);
      response(res, results.status, results.results, results.message);
   } catch (e) {
      //Catch all the errors
      console.log("e", e);
      response(res, 400, [], "Error creating User")
   }
});

module.exports = router;