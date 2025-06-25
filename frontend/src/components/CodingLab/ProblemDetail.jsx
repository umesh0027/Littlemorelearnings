// edtech-frontend/src/components/CodingLab/ProblemDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProblemDetail.css";
import axios from "axios";

export default function ProblemDetail() {
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          // `http://localhost:5000/api/codingproblems/${problemId}`
          `${process.env.REACT_APP_BASE_URL}/codingproblems/${problemId}`
        );
        setProblem(response.data);
        // Set default language if solutions exist
        if (
          response.data &&
          response.data.solutions &&
          response.data.solutions.length > 0
        ) {
          setSelectedLanguage(response.data.solutions[0].language);
        }
      } catch (err) {
        console.error("Error fetching problem details:", err);
        setError("Failed to load problem details. It might not exist.");
        setProblem(null); // Ensure problem is null on error
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]); // Re-fetch when problemId changes

  // Derive current solution based on fetched problem and selected language
  const currentSolution = problem?.solutions?.find(
    (sol) => sol.language === selectedLanguage
  );

  // Helper function for topic intro (can remain client-side logic)
  const getTopicIntro = (topic) => {
    switch (topic) {
      case "Arrays":
        return "Arrays are one of the most fundamental data structures, consisting of a collection of elements identified by index or key.";
      case "Trees":
        return "Trees are non-linear data structures with a hierarchical relationship between elements, often used to represent hierarchical data.";
      case "Graphs":
        return "Graphs are non-linear data structures consisting of nodes (vertices) and edges, representing relationships between entities.";
      case "Linked Lists":
        return "Linked lists are linear data structures where elements are stored at non-contiguous memory locations, linked by pointers.";
      case "Queues":
        return "Queues are linear data structures that follow the First-In, First-Out (FIFO) principle, where elements are added to the rear and removed from the front.";
      case "Stacks":
        return "Stacks are linear data structures that follow the Last-In, First-Out (LIFO) principle, where elements are added and removed from the top.";
      case "Dynamic Programming":
        return "Dynamic Programming is a method for solving complex problems by breaking them down into simpler subproblems.";
      default:
        return "Explore various data structures and algorithms to enhance your problem-solving skills.";
    }
  };

  if (loading) {
    return (
      <div className="problem-detail-container">
        <p>Loading problem...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="problem-detail-container">
        <p className="problem-not-found">{error}</p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="problem-detail-container">
        <p className="problem-not-found">Problem not found.</p>
      </div>
    );
  }

  return (
    <div className="problem-detail-container">
      <div className="back-link">
        <Link to="/coding-lab" className="back-to-lab">
          &larr; Back to Coding Lab
        </Link>
      </div>

      <div className="problem-header">
        <h1>{problem.title}</h1>
        <div className="problem-tags">
          {" "}
          {/* Changed from problem-meta-tags */}
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
      </div>

      <div className="problem-content">
        <h2>About {problem.topic}</h2>
        <p>{getTopicIntro(problem.topic)}</p>

        <h2>Problem Statement</h2>
        <p>{problem.description}</p>

        {/* Display example inputs/outputs if they exist */}
        {(problem.example_input || problem.example_output) && (
          <div>
            {" "}
            {/* No specific class for the overall example section, just individual examples */}
            <h2>Examples</h2>
            {problem.example_input && (
              <div className="example">
                <h3>Example Input:</h3>
                <pre>{problem.example_input}</pre>
              </div>
            )}
            {problem.example_output && (
              <div className="example example-output">
                {" "}
                {/* Added example-output class */}
                <h3>Example Output:</h3>
                <pre>{problem.example_output}</pre>
              </div>
            )}
          </div>
        )}

        <div className="solution-section">
          {" "}
          {/* Added solution-section div */}
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="solution-btn"
          >
            {showSolution ? "Hide Solution" : "View Solution"}
          </button>
        </div>

        {showSolution && (
          <div className="code-viewer">
            <div className="tab-buttons">
              {problem.solutions &&
                problem.solutions.map((sol) => (
                  <button
                    key={sol.language}
                    className={`tab-btn ${
                      selectedLanguage === sol.language ? "active" : ""
                    }`}
                    onClick={() => setSelectedLanguage(sol.language)}
                  >
                    {sol.language.toUpperCase()}
                  </button>
                ))}
            </div>
            <div className="code-block">
              <pre>
                <code>
                  {currentSolution
                    ? currentSolution.code
                    : "Solution not available for this language."}
                </code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}