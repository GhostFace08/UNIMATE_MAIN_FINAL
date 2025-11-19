
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  "conversation_id": "String",
  "role": "String",
  "content": "String"
}, {timestamps:true});
module.exports = mongoose.model('ChatMessage', schema);
