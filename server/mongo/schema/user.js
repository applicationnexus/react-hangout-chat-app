const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//User schema
const user = new Schema({
   user_id: Number,
   name: String,
   email: String,
   picture: String,
   givenName: String,
   familyName: String,
   friends: [{
      id: String,
      email: String,
      name: String,
      picture: String,
      status: Boolean
   }],
   online: Boolean
});

exports.user = mongoose.model('user', user, 'users');