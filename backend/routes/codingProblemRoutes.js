// edtech-backend/routes/codingProblemRoutes.js
const express = require("express");
const router = express.Router();
const CodingProblem = require("../models/CodingProblem"); // Adjust path if necessary
const adminAuth = require("../middleware/adminAuth"); // Import the adminAuth middleware

// GET all coding problems (with optional multi-filtering)
router.get("/", async (req, res) => {
  try {
    const { topic, level } = req.query;
    let query = {};

    if (topic) {
      const topicsArray = topic.split(",");
      query.topic = { $in: topicsArray };
    }

    if (level) {
      const levelsArray = level.split(",");
      query.level = { $in: levelsArray };
    }

    const problems = await CodingProblem.find(query);
    res.json(problems);
  } catch (err) {
    console.error("Error fetching coding problems:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET a single coding problem by ID
router.get("/:id", async (req, res) => {
  try {
    const problem = await CodingProblem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: "Coding problem not found" });
    }
    res.json(problem);
  } catch (err) {
    console.error("Error fetching single coding problem:", err);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid problem ID format" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// POST a new coding problem (Admin functionality)
router.post("/", adminAuth, async (req, res) => {
  try {
    // Basic validation
    const {
      title,
      description,
      topic,
      level,
      example_input,
      example_output,
      solutions,
      test_cases,
    } = req.body;

    if (
      !title ||
      !description ||
      !topic ||
      !level ||
      !solutions ||
      solutions.length === 0 ||
      !test_cases ||
      test_cases.length === 0
    ) {
      return res
        .status(400)
        .json({
          message:
            "Required fields for coding problem are missing (title, description, topic, level, solutions, test cases).",
        });
    }

    const newProblem = new CodingProblem(req.body);
    const savedProblem = await newProblem.save();
    res.status(201).json(savedProblem);
  } catch (err) {
    console.error("Error creating coding problem:", err);
    if (err.name === "ValidationError") {
      let errors = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return res.status(400).json({ message: "Validation failed", errors });
    }
    res
      .status(500)
      .json({ message: "Failed to create coding problem. " + err.message });
  }
});

// DELETE a coding problem by ID (Admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProblem = await CodingProblem.findByIdAndDelete(id);

    if (!deletedProblem) {
      return res.status(404).json({ message: "Coding problem not found." });
    }

    res.status(200).json({ message: "Coding problem deleted successfully." });
  } catch (err) {
    console.error("Error deleting coding problem:", err);
    res
      .status(500)
      .json({ message: "Failed to delete coding problem. " + err.message });
  }
});



router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProblem = await CodingProblem.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProblem) {
      return res.status(404).json({ message: "Coding problem not found." });
    }

    res.status(200).json({
      message: "Coding problem updated successfully.",
      updatedProblem,
    });
  } catch (err) {
    console.error("Error updating coding problem:", err);
    res.status(500).json({
      message: "Failed to update coding problem. " + err.message,
    });
  }
});


module.exports = router;
