const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Invite schema
const invite = new Schema({
   to: String,
   from: {
      type: Schema.Types.ObjectId,
      ref: 'user'
   },
   status: String
});

exports.invites = mongoose.model('invite', invite, 'invites');