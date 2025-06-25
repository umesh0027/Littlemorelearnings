// ----- CodingProblems.jsx -------

import React, { useState, useEffect } from "react";
import "./CodingProblems.css";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios

const topics = [
  "Arrays",
  "Trees",
  "Graphs",
  "Linked Lists",
  "Queues",
  "Stacks",
  "Dynamic Programming",
];

const difficulties = ["Beginner", "Intermediate", "Advanced"];

export default function CodingProblems() {
  // Change state to hold arrays for multiple selections
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [problems, setProblems] = useState([]); // Problems fetched from backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to toggle selection for topics
  const handleTopicToggle = (topic) => {
    setSelectedTopics(
      (prevSelected) =>
        prevSelected.includes(topic)
          ? prevSelected.filter((t) => t !== topic) // Remove if already selected
          : [...prevSelected, topic] // Add if not selected
    );
  };

  // Function to toggle selection for difficulties
  const handleDifficultyToggle = (difficulty) => {
    setSelectedDifficulties(
      (prevSelected) =>
        prevSelected.includes(difficulty)
          ? prevSelected.filter((d) => d !== difficulty) // Remove if already selected
          : [...prevSelected, difficulty] // Add if not selected
    );
  };

  // Function to clear all filters
  const handleClearFilters = () => {
    setSelectedTopics([]);
    setSelectedDifficulties([]);
  };

  // useEffect to fetch problems from backend whenever filters change
  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      setError(null);
      try {
        // Construct query parameters
        const queryParams = new URLSearchParams();
        if (selectedTopics.length > 0) {
          queryParams.append("topic", selectedTopics.join(",")); // Send as comma-separated string
        }
        if (selectedDifficulties.length > 0) {
          queryParams.append("level", selectedDifficulties.join(",")); // Send as comma-separated string
        }

        const response = await axios.get(
          // `http://localhost:5000/api/codingproblems?${queryParams.toString()}`
          `${process.env.REACT_APP_BASE_URL}/codingproblems?${queryParams.toString()}`

        );
        setProblems(response.data);
      } catch (err) {
        console.error("Error fetching coding problems:", err);
        setError("Failed to fetch coding problems. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [selectedTopics, selectedDifficulties]); // Re-run effect when filters change

  return (
    <div className="coding-problems-container">
      <h1 className="section-title">Coding Lab</h1>
      <p className="section-subtitle">
        Sharpen your coding skills with our curated problems.
      </p>

      <div className="filter-section">
        <div className="filter-group">
          <h3>Filter by Topic:</h3>
          <div className="filter-buttons">
            {topics.map((topic, idx) => (
              <button
                key={idx}
                className={`filter-btn ${
                  selectedTopics.includes(topic) ? "active" : ""
                }`}
                onClick={() => handleTopicToggle(topic)}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3>Filter by Difficulty:</h3>
          <div className="filter-buttons">
            {difficulties.map((difficulty, idx) => (
              <button
                key={idx}
                className={`filter-btn ${
                  selectedDifficulties.includes(difficulty) ? "active" : ""
                }`}
                onClick={() => handleDifficultyToggle(difficulty)}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        <div className="clear-filters">
          <button onClick={handleClearFilters} className="clear-btn">
            Clear All Filters
          </button>
        </div>
      </div>

      {loading && <p className="loading-message">Loading problems...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && problems.length === 0 && (
        <div className="no-results">
          No coding problems found matching your filters.
        </div>
      )}

      {!loading && !error && problems.length > 0 && (
        <div className="problems-grid">
          {problems.map((problem) => (
            <div key={problem._id} className="problem-card">
              <div className="card-tags">
                <span
                  className={`tag topic ${problem.topic
                    .toLowerCase()
                    .replace(/\s/g, "-")}`}
                >
                  {problem.topic}
                </span>
                <span className={`tag level ${problem.level.toLowerCase()}`}>
                  {problem.level}
                </span>
              </div>
              <h2 className="problem-title">{problem.title}</h2>
              <p className="problem-desc">
                {problem.description.substring(0, 100)}...
              </p>
              <Link to={`/coding-lab/${problem._id}`} className="view-link">
                View Problem &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}