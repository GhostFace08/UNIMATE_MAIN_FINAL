
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  "user_id": "String",
  "title": "String",
  "description": "String",
  "target_date": "Date",
  "status": "String",
  "priority": "String"
}, {timestamps:true});
module.exports = mongoose.model('CareerGoal', schema);
