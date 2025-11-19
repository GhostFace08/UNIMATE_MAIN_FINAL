
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  "user_id": "String",
  "category": "String",
  "amount": "Number",
  "month": "Date"
}, {timestamps:true});
module.exports = mongoose.model('FinanceBudget', schema);
