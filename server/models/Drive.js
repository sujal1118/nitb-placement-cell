const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  registrationLink: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed'],
    default: 'upcoming'
  }
}, { timestamps: true });

module.exports = mongoose.model('Drive', driveSchema);