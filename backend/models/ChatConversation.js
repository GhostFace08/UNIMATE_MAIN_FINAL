
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  "user_id": "String",
  "title": "String",
  "chat_type": "String"
}, {timestamps:true});
module.exports = mongoose.model('ChatConversation', schema);
