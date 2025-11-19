
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  "conversation_id": "String",
  "user_id": "String",
  "file_name": "String",
  "file_data": "String",
  "chat_type": "String"
}, {timestamps:true});
module.exports = mongoose.model('ChatDocument', schema);
