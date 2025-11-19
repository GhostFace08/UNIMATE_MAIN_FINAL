const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    serial: { type: String, unique: true, sparse: true },
    status: {
      type: String,
      enum: ['online', 'offline', 'unknown'],
      default: 'unknown',
    },
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Device', deviceSchema);
