const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [{ type: String, required: true }],
  // Add additional fields as needed
});

module.exports = mongoose.model('Assessment', assessmentSchema);
