const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true
  },
  branch: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isPlaced: {
    type: Boolean,
    default: false
  },
  placedCompany: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);