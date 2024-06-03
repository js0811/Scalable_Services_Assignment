// course-management-service/models/course.js

const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  type: {
    type: String,
    enum: ["text", "video", "audio", "quiz"],
    required: true,
  },
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  lessons: [lessonSchema],
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true,
  },
  language: { type: String, required: true },
});

module.exports = mongoose.model("Course", courseSchema);
