const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Chat schema
const groupChat = new Schema({
   members: Array,
   name: String,
   groupCreatedAt: {
      type: Date,
      default: Date.now
   },
   messages: [{
      from: {
         type: Schema.Types.ObjectId,
         ref: 'user'
      },
      message: String,
      createdAt: {
         type: Date,
         default: Date.now
      }
   }]
});

exports.groupChats = mongoose.model('groupChat', groupChat, 'groupChats');