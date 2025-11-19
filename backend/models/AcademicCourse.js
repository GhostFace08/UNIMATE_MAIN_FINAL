
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  "user_id": "String",
  "course_name": "String",
  "course_code": "String",
  "credits": "Number",
  "grade": "String",
  "semester": "String",
  "status": "String"
}, {timestamps:true});
module.exports = mongoose.model('AcademicCourse', schema);
