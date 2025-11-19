
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  "user_id": "String",
  "title": "String",
  "amount": "Number",
  "type": "String",
  "category": "String",
  "date": "Date",
  "notes": "String"
}, {timestamps:true});
module.exports = mongoose.model('FinanceTransaction', schema);
