
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  "user_id": "String",
  "subject": "String",
  "duration_minutes": "Number",
  "notes": "String",
  "date": "Date"
}, {timestamps:true});
module.exports = mongoose.model('AcademicStudySession', schema);
