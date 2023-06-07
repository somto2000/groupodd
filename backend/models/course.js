const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  level: { type: String, required: true },
  time: { type: Number, required: true },
  video: { type: Number, required: true },
  enrollee: { type: mongoose.Types.ObjectId, ref: "Enrollee", required: true }
  // Add additional fields as needed
});

module.exports = mongoose.model('Course', courseSchema);
