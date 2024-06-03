// course-management-service/routes/course.js

const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const course = new Course(req.body);
    const newCourse = await course.save();
    res.status(201).json(newCourse); // 201 Created
  } catch (err) {
    res.status(400).json({ message: err.message }); // 400 Bad Request for validation errors
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    const searchQuery = req.query.query;
    const courses = await Course.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ],
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/recommendations/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const response = await axios.get(
      `http://192.168.49.2:30001/users/${userId}/proficiency`
    );
    const userProficiency = response.data.proficiency;

    const courses = await Course.find({ level: userProficiency });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id/lessons", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course.lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:courseId/lessons", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    course.lessons.push(req.body); // Add the new lesson to the lessons array
    const updatedCourse = await course.save();
    res.status(201).json(updatedCourse.lessons); // Return updated lessons array
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ a specific lesson in a course (GET)
router.get(
  "/:courseId/lessons/:lessonId",

  async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      const lesson = course.lessons.id(req.params.lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      res.json(lesson);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// UPDATE a lesson in a course (PUT)
router.put(
  "/:courseId/lessons/:lessonId",

  async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      const lesson = course.lessons.id(req.params.lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      lesson.set(req.body); // Update lesson fields
      const updatedCourse = await course.save();
      res.json(updatedCourse.lessons);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// DELETE a lesson from a course (DELETE)
router.delete("/:courseId/lessons/:lessonId", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    course.lessons.id(req.params.lessonId).remove(); // Remove the lesson
    const updatedCourse = await course.save();
    res.json(updatedCourse.lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
