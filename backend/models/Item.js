
const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({
  title: String,
  data: mongoose.Schema.Types.Mixed,
},{ timestamps: true });
module.exports = mongoose.model('Item', itemSchema);
