const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const enrolleeSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8, },
  role: {
    type: Number,
    default: 0 // 0 = user, 1 = admin 
  },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }],
  Teacher: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model("Enrollee", enrolleeSchema);
