const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    level: { type: String, enum: ['info', 'warn', 'error'], default: 'info' },
    message: String,
    meta: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Log', logSchema);
