require("dotenv").config(); // Load environment variables

const mongoose = require("mongoose");
const Course = require("./models/Course"); // Import your Course model
const Video = require("./models/Video"); // Import your Video model

// Database Connection
const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log("MongoDB connected for seeding!");

    // Clear existing data (optional, but good for fresh starts)
    console.log("Clearing existing courses and videos...");
    await Course.deleteMany({});
    await Video.deleteMany({});
    console.log("Existing data cleared.");

    // Dummy Courses
    const courses = [
      {
        title: "Calculus I: Limits and Derivatives",
        description:
          "An introductory course covering limits, continuity, and differentiation.",
        category: "Mathematics",
        icon: "➕",
        duration: "8 hours",
      },
      {
        title: "Introduction to Python Programming",
        description:
          "Learn the fundamentals of Python, from variables to functions and basic data structures.",
        category: "Programming",
        icon: "🐍",
        duration: "12 hours",
      },
      {
        title: "Physics Fundamentals: Mechanics",
        description:
          "Explore the basic principles of classical mechanics, including motion, forces, and energy.",
        category: "Science",
        icon: "⚛️",
        duration: "10 hours",
      },
      {
        title: "Conversational Spanish for Beginners",
        description:
          "Master basic Spanish phrases and grammar for everyday conversations.",
        category: "Languages",
        icon: "🗣️",
        duration: "6 hours",
      },
      {
        title: "Digital Art: Photoshop Basics",
        description:
          "Learn the essentials of Adobe Photoshop for digital painting and photo manipulation.",
        category: "Arts",
        icon: "🎨",
        duration: "7 hours",
      },
    ];

    // Insert Courses
    const insertedCourses = await Course.insertMany(courses);
    console.log(
      "Courses seeded:",
      insertedCourses.map((c) => c.title)
    );

    // Dummy Videos (linking them to insertedCourses)
    const videos = [
      // Videos for Calculus I
      {
        courseId: insertedCourses[0]._id, // First course (Calculus I)
        title: "Limits and Continuity",
        url: "/videos/limits.mp4",
        description: "Introduction to limits and basic concepts of continuity.",
        pdf_url: "/pdfs/limits.pdf",
        order: 0,
      },
      {
        courseId: insertedCourses[0]._id,
        title: "Derivatives Basics",
        url: "/videos/derivatives.mp4",
        description:
          "Learn the basics of derivatives, including the power rule and product rule.",
        pdf_url: "", // No PDF for this one
        order: 1,
      },
      {
        courseId: insertedCourses[0]._id,
        title: "Chain Rule and Implicit Differentiation",
        url: "/videos/chain_implicit.mp4",
        description:
          "Advanced differentiation techniques for complex functions.",
        pdf_url: "/pdfs/chain_implicit.pdf",
        order: 2,
      },
      // Videos for Python Programming
      {
        courseId: insertedCourses[1]._id, // Second course (Python)
        title: "Variables and Data Types",
        url: "/videos/python_vars.mp4",
        description:
          "Understanding fundamental Python data types and variable declaration.",
        pdf_url: "/pdfs/python_vars.pdf",
        order: 0,
      },
      {
        courseId: insertedCourses[1]._id,
        title: "Control Flow: If/Else and Loops",
        url: "/videos/python_flow.mp4",
        description:
          "Control program execution with conditional statements and loops.",
        pdf_url: "/pdfs/python_flow.pdf",
        order: 1,
      },
      {
        courseId: insertedCourses[1]._id,
        title: "Functions in Python",
        url: "/videos/python_functions.mp4",
        description: "Define and use functions to organize your Python code.",
        pdf_url: "",
        order: 2,
      },
      // Videos for Physics Fundamentals
      {
        courseId: insertedCourses[2]._id, // Third course (Physics)
        title: "Kinematics: Motion in 1D",
        url: "/videos/physics_kinematics.mp4",
        description:
          "Introduction to motion in one dimension, displacement, velocity, and acceleration.",
        pdf_url: "/pdfs/physics_kinematics.pdf",
        order: 0,
      },
      {
        courseId: insertedCourses[2]._id,
        title: "Newton's Laws of Motion",
        url: "/videos/physics_newton.mp4",
        description:
          "Understanding Newton's three laws and their applications.",
        pdf_url: "/pdfs/physics_newton.pdf",
        order: 1,
      },
      // Videos for Conversational Spanish
      {
        courseId: insertedCourses[3]._id, // Fourth course (Spanish)
        title: "Greetings and Introductions",
        url: "/videos/spanish_greetings.mp4",
        description:
          "Learn basic greetings and how to introduce yourself in Spanish.",
        pdf_url: "/pdfs/spanish_greetings.pdf",
        order: 0,
      },
      {
        courseId: insertedCourses[3]._id,
        title: "Asking and Giving Directions",
        url: "/videos/spanish_directions.mp4",
        description:
          "Essential phrases for navigating and asking for locations.",
        pdf_url: "",
        order: 1,
      },
      // Videos for Digital Art
      {
        courseId: insertedCourses[4]._id, // Fifth course (Arts)
        title: "Interface and Basic Tools",
        url: "/videos/photoshop_interface.mp4",
        description:
          "Familiarize yourself with the Photoshop workspace and essential tools.",
        pdf_url: "/pdfs/photoshop_interface.pdf",
        order: 0,
      },
      {
        courseId: insertedCourses[4]._id,
        title: "Layers and Masks",
        url: "/videos/photoshop_layers.mp4",
        description:
          "Understand how to use layers and masks for non-destructive editing.",
        pdf_url: "/pdfs/photoshop_layers.pdf",
        order: 1,
      },
    ];

    // Insert Videos
    await Video.insertMany(videos);
    console.log("Videos seeded.");

    // Update courses_count for each course
    for (const course of insertedCourses) {
      const videoCount = await Video.countDocuments({ courseId: course._id });
      course.videos_count = videoCount;
      await course.save();
    }
    console.log("Course video counts updated.");
  })
  .catch((err) =>
    console.error("MongoDB connection error during seeding:", err)
  )
  .finally(() => {
    mongoose.connection.close(); // Close the connection after seeding
    console.log("MongoDB connection closed.");
});