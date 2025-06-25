// edtech-backend/models/Course.js

const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // Removes whitespace from both ends of a string
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Mathematics",
        "Science",
        "Programming",
        "Languages",
        "Arts",
        "All Subjects",
      ], // Ensure category is one of these
    },
    icon: {
      type: String, // You're using emojis or simple strings for icons in frontend
      default: "📚", // Default icon if not provided
    },
    videos: {
      // Number of videos in the course
      type: Number,
      default: 0,
    },
    duration: {
      // Overall course duration (e.g., "10 hours", "Self-paced")
      type: String,
      required: false, // Not strictly required
    },
    thumbnail_url: {
      // Optional: for a course thumbnail image
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` timestamps automatically
  }
);

// Export the Course model, which can then be used to interact with the 'courses' collection
module.exports = mongoose.model("Course", courseSchema);
