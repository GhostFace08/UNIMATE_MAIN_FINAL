
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  "user_id": "String",
  "file_name": "String",
  "file_data": "String",
  "upload_date": "Date"
}, {timestamps:true});
module.exports = mongoose.model('CareerResume', schema);
