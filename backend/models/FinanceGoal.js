
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  "user_id": "String",
  "title": "String",
  "target_amount": "Number",
  "current_amount": "Number",
  "deadline": "Date"
}, {timestamps:true});
module.exports = mongoose.model('FinanceGoal', schema);
