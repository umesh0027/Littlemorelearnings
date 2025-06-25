// edtech-backend/models/Video.js

const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId, // This is how we reference another document
      ref: "Course", // This specifies that it refers to the 'Course' model
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      // Path to the video file
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false, // Description might not be present for every video
      trim: true,
    },
    pdf_url: {
      // Path to the associated PDF notes
      type: String,
      default: "", // Default to an empty string if no PDF is available
      trim: true,
    },
    order: {
      // To maintain the sequence of videos within a course
      type: Number,
      required: true,
      min: 0, // Order should be a positive number or zero
    },
    duration: {
      // Optional: for individual video duration (e.g., "15:30")
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add an index to improve performance when querying videos by courseId and order
videoSchema.index({ courseId: 1, order: 1 });

// Export the Video model, which can then be used to interact with the 'videos' collection
module.exports = mongoose.model("Video", videoSchema);
