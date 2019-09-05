const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Private chat schema
const chat = new Schema({
   members: Array,
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

exports.chats = mongoose.model('chat', chat, 'chats');