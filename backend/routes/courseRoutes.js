// edtech-backend/routes/courseRoutes.js
const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const Video = require("../models/Video");
const adminAuth = require("../middleware/adminAuth");
// const fs = require('fs/promises'); // Uncomment if you need to delete physical PDF files
// const path = require('path');     // Uncomment if you need to delete physical PDF files

// --- ADMIN ROUTES (Protected) ---

// POST a new course (Admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const { title, description, category, videos, duration } = req.body;

    if (!title || !description || !category || !videos || !duration) {
      return res
        .status(400)
        .json({ message: "All course fields are required." });
    }

    const newCourse = new Course({
      title,
      description,
      category,
      videos: parseInt(videos, 10),
      duration,
    });
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (err) {
    console.error("Error creating course:", err);
    if (err.name === "ValidationError") {
      let errors = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return res.status(400).json({ message: "Validation failed", errors });
    }
    res
      .status(500)
      .json({ message: "Failed to create course. " + err.message });
  }
});

// DELETE a course by ID (Admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Delete all videos associated with this course to maintain data integrity
    const videoDeleteResult = await Video.deleteMany({ courseId: id });
    console.log(
      `Deleted ${videoDeleteResult.deletedCount} videos for course ${id}.`
    );

    res
      .status(200)
      .json({ message: "Course and associated videos deleted successfully." });
  } catch (err) {
    console.error("Error deleting course:", err);
    res
      .status(500)
      .json({ message: "Failed to delete course. " + err.message });
  }
});

// POST a new video for a specific course (Admin only)
router.post("/:courseId/videos", adminAuth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, url, description, pdf_url, order } = req.body;

    if (!courseId || !title || !url || order === undefined || order === null) {
      return res
        .status(400)
        .json({
          message: "Course ID, title, URL, and order are required for video.",
        });
    }

    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return res.status(404).json({ message: "Course not found." });
    }

    const newVideo = new Video({
      courseId,
      title,
      url,
      description,
      pdf_url,
      order: parseInt(order, 10),
    });
    const savedVideo = await newVideo.save();
    res.status(201).json(savedVideo);
  } catch (err) {
    console.error("Error creating video:", err);
    if (err.name === "ValidationError") {
      let errors = {};
      for (let field in err.errors) {
        errors[field] = err.errors[field].message;
      }
      return res.status(400).json({ message: "Validation failed", errors });
    }
    res.status(500).json({ message: "Failed to create video. " + err.message });
  }
});

// DELETE a specific video from a course (Admin only)
router.delete("/:courseId/videos/:videoId", adminAuth, async (req, res) => {
  try {
    const { courseId, videoId } = req.params;

    const video = await Video.findOne({ _id: videoId, courseId: courseId });
    if (!video) {
      return res
        .status(404)
        .json({ message: "Video not found in this course." });
    }

    const deletedVideo = await Video.findByIdAndDelete(videoId);

    if (!deletedVideo) {
      return res.status(404).json({ message: "Video not found." });
    }

    // Optional: Delete associated PDF file from server storage if implemented
    // const fs = require('fs/promises');
    // const path = require('path');
    // if (deletedVideo.pdf_url) {
    //   const pdfPath = path.join(__dirname, '../public', deletedVideo.pdf_url);
    //   try {
    //     await fs.unlink(pdfPath);
    //     console.log(`Deleted PDF file: ${pdfPath}`);
    //   } catch (fileErr) {
    //     console.error(`Error deleting PDF file ${pdfPath}:`, fileErr);
    //   }
    // }

    res.status(200).json({ message: "Video deleted successfully." });
  } catch (err) {
    console.error("Error deleting video:", err);
    res.status(500).json({ message: "Failed to delete video. " + err.message });
  }
});

// --- PUBLIC ROUTES (No protection needed, already existing) ---

// GET all courses
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    let courses;
    if (category && category !== "All Subjects") {
      courses = await Course.find({ category: category });
    } else {
      courses = await Course.find({});
    }
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET videos for a specific course
router.get("/:courseId/videos", async (req, res) => {
  try {
    const { courseId } = req.params;
    const videos = await Video.find({ courseId: courseId }).sort({ order: 1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// NEW PUBLIC ROUTE: GET all videos across all courses
router.get("/all-videos", async (req, res) => {
  // Renamed from /videos to /all-videos to avoid conflict
  try {
    const videos = await Video.find({}).populate("courseId", "title"); // Populate course title
    res.json(videos);
  } catch (err) {
    console.error("Error fetching all videos:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET a single course by ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT (Update) a course by ID (Admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, category, videos, duration } = req.body;

    if (!title || !description || !category || videos === undefined || !duration) {
      return res.status(400).json({ message: "All course fields are required." });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      {
        title,
        description,
        category,
        videos: parseInt(videos, 10),
        duration,
      },
      { new: true } // Return the updated document
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found." });
    }

    res.json(updatedCourse);
  } catch (err) {
    console.error("Error updating course:", err);
    res.status(500).json({ message: "Failed to update course. " + err.message });
  }
});


// DELETE a course by ID (Admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if course exists
    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Delete the course
    const deletedCourse = await Course.findByIdAndDelete(id);

    // Delete all associated videos
    const videoDeleteResult = await Video.deleteMany({ courseId: id });
    console.log(`Deleted ${videoDeleteResult.deletedCount} videos for course ${id}.`);

    res.status(200).json({
      message: "Course and associated videos deleted successfully.",
      deletedCourse,
      deletedVideosCount: videoDeleteResult.deletedCount
    });
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ message: "Failed to delete course. " + err.message });
  }
});




// UPDATE a specific video by ID
router.put("/:courseId/videos/:videoId", adminAuth, async (req, res) => {
  try {
    const { courseId, videoId } = req.params;
    const updateData = req.body;

    const video = await Video.findOneAndUpdate(
      { _id: videoId, courseId: courseId },
      updateData,
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ message: "Video not found." });
    }

    res.status(200).json({ message: "Video updated successfully.", video });
  } catch (err) {
    console.error("Error updating video:", err);
    res.status(500).json({ message: "Failed to update video. " + err.message });
  }
});

// DELETE a specific video (Already present but adding here for clarity)
router.delete("/:courseId/videos/:videoId", adminAuth, async (req, res) => {
  try {
    const { courseId, videoId } = req.params;

    const video = await Video.findOneAndDelete({ _id: videoId, courseId: courseId });

    if (!video) {
      return res.status(404).json({ message: "Video not found." });
    }

    res.status(200).json({ message: "Video deleted successfully." });
  } catch (err) {
    console.error("Error deleting video:", err);
    res.status(500).json({ message: "Failed to delete video. " + err.message });
  }
});


// Update video for a specific course
router.put("/:courseId/videos/:videoId", async (req, res) => {
    try {
        const { courseId, videoId } = req.params;
        const updateData = req.body;

        // Find the video and update
        const updatedVideo = await CourseVideo.findOneAndUpdate(
            { _id: videoId, courseId: courseId }, // Ensure video belongs to the course
            updateData,
            { new: true }
        );

        if (!updatedVideo) {
            return res.status(404).json({ message: "Video not found for this course." });
        }

        res.json(updatedVideo);
    } catch (error) {
        console.error("Error updating video:", error);
        res.status(500).json({ message: "Server error while updating video." });
    }
});



module.exports = router;
