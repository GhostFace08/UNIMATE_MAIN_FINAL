
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  "user_id": "String",
  "company": "String",
  "position": "String",
  "status": "String",
  "application_date": "Date",
  "notes": "String"
}, {timestamps:true});
module.exports = mongoose.model('CareerApplication', schema);
