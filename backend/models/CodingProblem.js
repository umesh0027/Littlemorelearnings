// edtech-backend/models/CodingProblem.js
const mongoose = require("mongoose");

const CodingProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    // Full problem statement
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
    enum: [
      "Arrays",
      "Trees",
      "Graphs",
      "Linked Lists",
      "Queues",
      "Stacks",
      "Dynamic Programming",
    ],
  },
  level: {
    // Difficulty level
    type: String,
    required: true,
    enum: ["Beginner", "Intermediate", "Advanced"],
  },
  example_input: {
    type: String,
    default: null,
  },
  example_output: {
    type: String,
    default: null,
  },
  solutions: [
    {
      language: {
        type: String,
        required: true,
        enum: ["python", "java", "c", "cpp"],
      },
      code: {
        type: String,
        required: true,
      },
    },
  ],
  test_cases: [
    {
      input: {
        type: String,
        required: true,
      },
      expected_output: {
        type: String,
        required: true,
      },
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

CodingProblemSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const CodingProblem = mongoose.model("CodingProblem", CodingProblemSchema);

module.exports = CodingProblem;
