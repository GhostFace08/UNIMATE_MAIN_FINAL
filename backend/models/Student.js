const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    roll: { type: String, unique: true },
    email: { type: String, unique: true },
    enrolledAt: Date,
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
