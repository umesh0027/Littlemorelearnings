// ----- AdminPanel.jsx -------

import React, { useState, useEffect } from "react";
import "./AdminPanel.css";
import axios from "axios"; // Import axios for API calls

const initialCategories = {
  Mathematics: "➗",
  Science: "🧪",
  Programming: "💻",
  Languages: "🗣️",
  Arts: "🎨",
};

const levels = ["Beginner", "Intermediate", "Advanced"];

const topics = [
  "Arrays",
  "Trees",
  "Graphs",
  "Linked Lists",
  "Queues",
  "Stacks",
  "Dynamic Programming",
];


export default function AdminPanel() {
  // Login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
const [allVideos, setAllVideos] = useState([]);
const [editingVideo, setEditingVideo] = useState(null);
const [allCodingProblems, setAllCodingProblems] = useState([]);

const [editingCodingProblem, setEditingCodingProblem] = useState(null);


  // Active section state
  const [activeSection, setActiveSection] = useState(null);

  // Category state
  const [categories, setCategories] = useState(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("➕");
  const [showAddCategory, setShowAddCategory] = useState(false);

  // Course state
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    category: "Mathematics",
    videos: "",
    duration: "",
  });

  // State to store the fetched list of courses
  const [coursesList, setCoursesList] = useState([]);

  // Course Video state - UPDATED: Added 'order' and renamed 'pdf' to 'pdf_url'
  const [videoForm, setVideoForm] = useState({
    courseId: "",
    title: "",
    url: "",
    description: "",
    pdf_url: "", // Changed from 'pdf' to 'pdf_url'
    order: "", // NEW: Added order field
  });

  // Coding Lab state
  const [codingLabForm, setCodingLabForm] = useState({
    topic: "",
    level: "Beginner",
    description: "",
    example_input: "",
    example_output: "",
    solutions: [{ language: "python", code: "" }],
    test_cases: [{ input: "", expected_output: "" }],
  });

  // State for dynamic coding problem solutions/test cases
  const [currentSolutionLanguage, setCurrentSolutionLanguage] = useState("python");
  const [currentTestCaseInput, setCurrentTestCaseInput] = useState("");
  const [currentTestCaseOutput, setCurrentTestCaseOutput] = useState("");


  // Scroll to top on activeSection change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSection]);

  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsLoggedIn(true);
      fetchCourses(); // Fetch courses if already logged in
    }
  }, []);

  // Function to fetch courses from the backend
  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/courses`
);
      setCoursesList(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // UseEffect to fetch courses when the component first mounts or when isLoggedIn changes
  useEffect(() => {
    if (isLoggedIn) { // Only fetch if user is logged in
      fetchCourses();
    }
  }, [isLoggedIn]);


  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMessage(null);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/admin/login`
, {
        username,
        password,
      });

      localStorage.setItem("adminToken", response.data.token);
      setIsLoggedIn(true);
      setLoginMessage({ type: "success", text: response.data.message });
      setUsername("");
      setPassword("");
      setActiveSection(null);
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      setLoginMessage({ type: "error", text: error.response?.data?.message || "Login failed. Please try again." });
      setPassword("");
    }
  };


  const fetchAllVideos = async () => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    alert("You are not logged in.");
    return;
  }

  try {
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/courses/all-videos`
, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAllVideos(response.data);
    setActiveSection("allVideos"); // Switch to the videos section
  } catch (error) {
    console.error("Error fetching all videos:", error.response?.data?.message || error.message);
    alert("Failed to fetch videos: " + (error.response?.data?.message || "Server error"));
  }
};

const fetchAllCodingProblems = async () => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    alert("You are not logged in.");
    return;
  }

  try {
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/codingproblems`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAllCodingProblems(response.data);
    setActiveSection("allCodingProblems"); // Navigate to the coding problems list
  } catch (error) {
    console.error("Error fetching coding problems:", error.response?.data?.message || error.message);
    alert("Failed to fetch coding problems: " + (error.response?.data?.message || "Server error"));
  }
};


  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsLoggedIn(false);
    setActiveSection(null);
    setLoginMessage({ type: "success", text: "Logged out successfully." });
    setCoursesList([]); // Clear courses list on logout
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory === "Add Category") {
      setShowAddCategory(true);
      setCourseForm((prev) => ({ ...prev, category: "Mathematics" }));
    } else {
      setShowAddCategory(false);
      setCourseForm((prev) => ({ ...prev, category: selectedCategory }));
    }
  };

  // Add new category (currently frontend-only)
  const handleAddCategory = () => {
    if (newCategoryName.trim() && !categories[newCategoryName]) {
      setCategories((prev) => ({
        ...prev,
        [newCategoryName]: newCategoryIcon,
      }));
      setNewCategoryName("");
      setNewCategoryIcon("➕");
      setShowAddCategory(false);
      setCourseForm((prev) => ({ ...prev, category: newCategoryName }));
    } else {
      alert("Category name is required and must be unique.");
    }
  };

  // Form change handlers
  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourseForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVideoChange = (e) => {
    const { name, value } = e.target;
    // Special handling for 'order' to convert to number if needed
    setVideoForm((prev) => ({ ...prev, [name]: name === "order" ? parseInt(value, 10) : value }));
  };

  const handleCodingLabChange = (e) => {
    const { name, value } = e.target;
    setCodingLabForm((prev) => ({ ...prev, [name]: value }));
  };

  // --- Coding Lab Solution/Test Case Handlers ---
  const handleAddSolution = () => {
    if (codingLabForm.solutions.length === 0 || codingLabForm.solutions[codingLabForm.solutions.length -1].code) {
      setCodingLabForm(prev => ({
          ...prev,
          solutions: [...prev.solutions, { language: currentSolutionLanguage, code: "" }]
      }));
    } else {
        alert("Please add code for the current solution before adding another.");
    }
  };

  const handleSolutionCodeChange = (index, code) => {
    const updatedSolutions = [...codingLabForm.solutions];
    updatedSolutions[index].code = code;
    setCodingLabForm(prev => ({ ...prev, solutions: updatedSolutions }));
  };

  const handleSolutionLanguageChange = (index, language) => {
    const updatedSolutions = [...codingLabForm.solutions];
    updatedSolutions[index].language = language;
    setCodingLabForm(prev => ({ ...prev, solutions: updatedSolutions }));
  };

  const handleRemoveSolution = (index) => {
    setCodingLabForm(prev => ({
      ...prev,
      solutions: prev.solutions.filter((_, i) => i !== index)
    }));
  };

  const handleAddTestCase = () => {
    if (currentTestCaseInput && currentTestCaseOutput) {
      setCodingLabForm(prev => ({
        ...prev,
        test_cases: [...prev.test_cases, { input: currentTestCaseInput, expected_output: currentTestCaseOutput }]
      }));
      setCurrentTestCaseInput("");
      setCurrentTestCaseOutput("");
    } else {
      alert("Please provide both input and expected output for the test case.");
    }
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...codingLabForm.test_cases];
    updatedTestCases[index][field] = value;
    setCodingLabForm(prev => ({ ...prev, test_cases: updatedTestCases }));
  };

  const handleRemoveTestCase = (index) => {
    setCodingLabForm(prev => ({
      ...prev,
      test_cases: prev.test_cases.filter((_, i) => i !== index)
    }));
  };

  const handleEditCourse = (course) => {
  setCourseForm({
    title: course.title,
    description: course.description,
    category: course.category,
    // videos: course.videos.toString(),
    videos: course.videos ? course.videos.toString() : "0",

    duration: course.duration,
  });
  setEditingCourse(course._id);
  setActiveSection("addCourse"); // Go to course form
};



const handleDeleteCourse = async (courseId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this course?");
  if (!confirmDelete) return;

  const token = localStorage.getItem("adminToken");
  if (!token) {
    alert("You are not logged in.");
    return;
  }

  try {
    await axios.delete(`${process.env.REACT_APP_BASE_URL}/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Course deleted successfully.");
    fetchCourses(); // Refresh course list
  } catch (error) {
    console.error("Error deleting course:", error.response?.data?.message || error.message);
    alert("Failed to delete course: " + (error.response?.data?.message || "Server error"));
  }
};

const handleEditVideo = (video) => {
  setVideoForm({
    courseId: video.courseId._id,
    title: video.title,
    url: video.url,
    description: video.description,
    pdf_url: video.pdf_url,
    order: video.order,
    _id: video._id, // Store video ID for editing
  });
  setEditingVideo(video._id);
  setActiveSection("addVideo"); // Switch to video form
};



const handleDeleteVideo = async (video) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this video?");
  if (!confirmDelete) return;

  const token = localStorage.getItem("adminToken");
  if (!token) {
    alert("You are not logged in.");
    return;
  }

  try {
    await axios.delete(`${process.env.REACT_APP_BASE_URL}/courses/${video.courseId._id}/videos/${video._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Video deleted successfully.");
    fetchAllVideos(); // Refresh videos list
  } catch (error) {
    console.error("Error deleting video:", error.response?.data?.message || error.message);
    alert("Failed to delete video: " + (error.response?.data?.message || "Server error"));
  }
};


const handleEditCodingProblem = (problem) => {
  setCodingLabForm({
    topic: problem.topic,
    level: problem.level,
    description: problem.description,
    example_input: problem.example_input,
    example_output: problem.example_output,
    solutions: problem.solutions,
    test_cases: problem.test_cases,
  });
  setEditingCodingProblem(problem._id);
  setActiveSection("codingLab"); // Go to form
};
const handleDeleteCodingProblem = async (problemId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this coding problem?");
  if (!confirmDelete) return;

  const token = localStorage.getItem("adminToken");
  if (!token) {
    alert("You are not logged in.");
    return;
  }

  try {
    await axios.delete(`${process.env.REACT_APP_BASE_URL}/codingproblems/${problemId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Coding problem deleted successfully.");
    fetchAllCodingProblems(); // Refresh list
  } catch (error) {
    console.error("Error deleting coding problem:", error.response?.data?.message || error.message);
    alert("Failed to delete coding problem: " + (error.response?.data?.message || "Server error"));
  }
};



const submitCourse = async () => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    alert("You are not logged in.");
    return;
  }

  try {
    const payload = {
      ...courseForm,
      videos: parseInt(courseForm.videos, 10),
    };

    // Check if editing mode and ID is valid
    if (editingCourse && typeof editingCourse === "string" && editingCourse.length === 24) {
      // Update existing course
      console.log("Updating Course ID:", editingCourse);
      await axios.put(`${process.env.REACT_APP_BASE_URL}/courses/${editingCourse}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Course updated successfully!");
    } else {
      // Add new course
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/courses`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Course submitted successfully: " + response.data.title);
    }

    // Reset form after submission
    setCourseForm({
      title: "",
      description: "",
      category: "Mathematics",
      videos: "",
      duration: "",
    });
    setEditingCourse(null); // Exit edit mode
    fetchCourses(); // Refresh the course list
    setActiveSection("allCourses"); // Navigate back to course list
  } catch (error) {
    console.error("Error submitting course:", error.response?.data?.message || error.message);
    alert("Failed to submit course: " + (error.response?.data?.message || "Server error"));
  }
};



const submitVideo = async () => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    alert("You are not logged in.");
    return;
  }

  try {
    // Ensure 'order' is a number before sending
    const payload = {
      ...videoForm,
      order: parseInt(videoForm.order, 10), // Ensure order is an integer
    };

    if (editingVideo) {
      // Edit Mode (PUT Request)
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/courses/${videoForm.courseId}/videos/${editingVideo}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Course Video updated successfully!");
    } else {
      // Add Mode (POST Request)
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/courses/${videoForm.courseId}/videos`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Course Video submitted successfully!");
    }

    // Reset Form
    setVideoForm({
      courseId: "",
      title: "",
      url: "",
      description: "",
      pdf_url: "",
      order: "",
    });
    setEditingVideo(null); // Exit edit mode
    fetchAllVideos(); // Refresh the video list if you have this function
  } catch (error) {
    console.error("Error submitting video:", error.response?.data?.message || error.message);
    alert("Failed to submit video: " + (error.response?.data?.message || "Server error"));
  }
};



const submitCodingLab = async () => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    alert("You are not logged in.");
    return;
  }

  try {
    const payload = {
      title: codingLabForm.description.substring(0, 50),
      description: codingLabForm.description,
      topic: codingLabForm.topic,
      level: codingLabForm.level,
      example_input: codingLabForm.example_input,
      example_output: codingLabForm.example_output,
      solutions: codingLabForm.solutions,
      test_cases: codingLabForm.test_cases,
    };

    if (editingCodingProblem) {
      // Update existing coding problem
      await axios.put(`${process.env.REACT_APP_BASE_URL}/codingproblems/${editingCodingProblem}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Coding problem updated successfully!");
    } else {
      // Add new coding problem
      await axios.post(`${process.env.REACT_APP_BASE_URL}/codingproblems`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Coding problem submitted successfully!");
    }

    // Reset form
    setCodingLabForm({
      topic: "",
      level: "Beginner",
      description: "",
      example_input: "",
      example_output: "",
      solutions: [{ language: "python", code: "" }],
      test_cases: [{ input: "", expected_output: "" }],
    });
    setEditingCodingProblem(null);
    fetchAllCodingProblems(); // Refresh list
    setActiveSection("allCodingProblems"); // Go back to list

  } catch (error) {
    console.error("Error submitting coding problem:", error.response?.data?.message || error.message);
    alert("Failed to submit coding problem: " + (error.response?.data?.message || "Server error"));
  }
};

  // Login view
  if (!isLoggedIn) {
    return (
      <div className="admin-panel login-panel">
        <h2 className="admin-title">Admin Panel Login</h2>
        <form onSubmit={handleLogin} className="form-container">
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              placeholder="Enter admin username"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter admin password"
            />
          </label>
          <button type="submit" className="submit-btn">
            Login
          </button>
          {loginMessage && (
            <p className={`login-message ${loginMessage.type}`}>
              {loginMessage.text}
            </p>
          )}
        </form>
      </div>
    );
  }

  // Main admin panel view
  return (
    <div className="admin-panel">
      <h1 className="admin-title">Welcome to Admin Panel</h1>

      {/* Main options */}
      {!activeSection && (
        <div className="main-options">
          <button
            onClick={() => setActiveSection("courseOptions")}
            className="main-btn"
          >
            Courses
          </button>
          {/* <button
            onClick={() => setActiveSection("codingLab")}
            className="main-btn"
          >
            Coding Lab
          </button> */}
          <button className="main-btn" onClick={() => setActiveSection("codingProblemMenu")}>
  Coding Lab
</button>

          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </button>
        </div>
      )}
    
{activeSection === "codingProblemMenu" && (
  <div className="coding-problem-menu">
    <h2>Coding Problem Menu</h2>
    <button className="sub-btn " onClick={fetchAllCodingProblems}> 📝 View All Coding Problems</button>
    <button className="sub-btn" onClick={() => setActiveSection("codingLab")}> ➕ Add New Coding Problem</button>
    <button className="back-btn " onClick={() => setActiveSection(null)} >← Back to Main Menu</button>
  </div>
)}



      {/* Course options */}
      {activeSection === "courseOptions" && (
        <div className="course-options">
          <div className="options-header">
            <button
              onClick={() => setActiveSection(null)}
              className="back-btn left"
            >
              ← Back to Main Menu
            </button>
            <h2>Course Management</h2>
          </div>
          <div className="options-buttons">
            <button
              onClick={() => setActiveSection("addCourse")}
              className="sub-btn"
            >
              ➕ Add Course
            </button>
            <button
  onClick={() => setActiveSection("allCourses")}
  className="sub-btn"
>
  📚 All Courses
</button>

            <button
              onClick={() => setActiveSection("addVideo")}
              className="sub-btn"
            >
              ➕ Add Course Video
            </button>

            <button onClick={fetchAllVideos} className="sub-btn">
   🎥 View All Videos
</button >




          </div>
        </div>
      )}


        {activeSection === "allCourses" && (
  <div className="all-courses-section">
    <div className="options-header">
      <button
        onClick={() => setActiveSection("courseOptions")}
        className="back-btn left"
      >
        ← Back
      </button>
      <h2>All Courses</h2>
    </div>
    {coursesList.length === 0 ? (
      <p>No courses found.</p>
    ) : (
      <div className="course-list">
     


{coursesList.map((course) => (
  <div key={course._id} className="course-card">
    <h3>{course.title}</h3>
    <p><strong>Description:</strong> {course.description}</p>
    <p><strong>Category:</strong> {course.category}</p>
    <p><strong>Duration:</strong> {course.duration}</p>
    <p><strong>Videos:</strong> {course.videos}</p>
    <div className="course-actions">
      <button onClick={() => handleEditCourse(course)} className="edit-btn">✏️ Edit</button>
      <button onClick={() => handleDeleteCourse(course._id)} className="delete-btn">🗑️ Delete</button>
    </div>
  </div>
))}

      </div>
    )}
  </div>
)}


{activeSection === "allVideos" && (
  <div className="all-videos-section course-options">
    <div className="options-header">
      <button className="back-btn left" onClick={() => setActiveSection(null)}>
        &larr; Back
      </button>
      <h2>All Videos</h2>
    </div>

    {allVideos.length === 0 ? (
      <p>No videos found.</p>
    ) : (
      <div className="video-list">
        {allVideos.map((video) => (
          <div key={video._id} className="video-card">
            <h4>{video.title}</h4>
            <p>Course: {video.courseId?.title || "Unknown"}</p>
            <a href={video.url} target="_blank" rel="noopener noreferrer">
              Watch Video
            </a>
            <div className="video-actions">
              <button className="edit-btn" onClick={() => handleEditVideo(video)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDeleteVideo(video)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}


{activeSection === "allCodingProblems" && (
  <div>
    <h2>All Coding Problems</h2>
    {allCodingProblems.length === 0 ? (
      <p>No coding problems found.</p>
    ) : (
      <ul>
        {allCodingProblems.map((problem) => (
          <li key={problem._id}>
            <strong>{problem.title}</strong> - {problem.topic} ({problem.level})
            <div className="coding-actions">
     <button onClick={() => handleEditCodingProblem(problem)} className="edit-btn">Edit</button>
            <button onClick={() => handleDeleteCodingProblem(problem._id)} className="delete-btn">Delete</button>
            </div>
       
          </li>
        ))}
      </ul>
    )}
    <button onClick={() => setActiveSection("codingProblemMenu")} className="back-btn">← Back to Coding Problem Menu</button>
  </div>
)}




      {/* Add Course form */}
      {activeSection === "addCourse" && (
        <div className="form-container">
          <h2>Add New Course</h2>

          <label>
            Title
            <input
              type="text"
              name="title"
              value={courseForm.title}
              onChange={handleCourseChange}
              placeholder="Course Title"
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={courseForm.description}
              onChange={handleCourseChange}
              placeholder="Course Description"
              rows={3}
              required
            />
          </label>

          <label>
            Category
            <select
              name="category"
              value={courseForm.category}
              onChange={handleCategoryChange}
              required
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="Programming">Programming</option>
              <option value="Languages">Languages</option>
              <option value="Arts">Arts</option>
              <option value="Add Category">➕ Add New Category</option>
            </select>
          </label>

          {showAddCategory && (
            <div className="add-category-form">
              <h3>Add New Category (Frontend Only for now)</h3>
              <div className="category-inputs">
                <label>
                  Category Name
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    required
                  />
                </label>
                <label>
                  Select Icon
                  <select
                    value={newCategoryIcon}
                    onChange={(e) => setNewCategoryIcon(e.target.value)}
                  >
                    <option value="➕">➕ Add</option>
                    <option value="⭐">⭐ Star</option>
                    <option value="🎯">🎯 Target</option>
                    <option value="📚">📚 Book</option>
                    <option value="🔬">🔬 Microscope</option>
                    <option value="💡">💡 Idea</option>
                  </select>
                </label>
              </div>
              <div className="form-buttons">
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="submit-btn"
                  disabled={!newCategoryName.trim()}
                >
                  Add Category
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategoryName("");
                    setNewCategoryIcon("➕");
                  }}
                  className="back-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <label>
            Number of Videos
            <input
              type="number"
              name="videos"
              value={courseForm.videos}
              onChange={handleCourseChange}
              min="1"
              placeholder="Total Videos"
              required
            />
          </label>

          <label>
            Duration (e.g. 5 hours)
            <input
              type="text"
              name="duration"
              value={courseForm.duration}
              onChange={handleCourseChange}
              placeholder="Total Duration"
              required
            />
          </label>

          <div className="form-buttons">
            <button onClick={submitCourse} className="submit-btn">
              Submit Course
            </button>
            <button
              onClick={() => setActiveSection("courseOptions")}
              className="back-btn"
            >
              ← Back to Course Options
            </button>
          </div>
        </div>
      )}

      {/* Add Course Video form */}
      {activeSection === "addVideo" && (
        <div className="form-container">
          <h2>Add Video to Course</h2>

          <label>
            Select Course
            <select
              name="courseId"
              value={videoForm.courseId}
              onChange={handleVideoChange}
              required
            >
              <option value="">-- Select a Course --</option>
              {coursesList.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title} ({course._id})
                </option>
              ))}
            </select>
          </label>

          <label>
            Video Title
            <input
              type="text"
              name="title"
              value={videoForm.title}
              onChange={handleVideoChange}
              placeholder="Video Title"
              required
            />
          </label>

          <label>
            Video URL
            <input
              type="url"
              name="url"
              value={videoForm.url}
              onChange={handleVideoChange}
              placeholder="Video URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)"
              required
            />
          </label>

          <label>
            Video Order (e.g., 1 for first video)
            <input
              type="number"
              name="order"
              value={videoForm.order}
              onChange={handleVideoChange}
              min="0"
              placeholder="Order in Course"
              required
            />
          </label>

          <label>
            PDF URL (optional)
            <input
              type="url"
              name="pdf_url" 
              value={videoForm.pdf_url}
              onChange={handleVideoChange}
              placeholder="PDF URL (e.g., https://example.com/notes.pdf)"
            />
          </label>

          <label>
            Video Description (optional)
            <textarea
              name="description"
              value={videoForm.description}
              onChange={handleVideoChange}
              placeholder="Video Description"
              rows={2}
            />
          </label>


          <div className="form-buttons">
            <button onClick={submitVideo} className="submit-btn">
              Submit Video
            </button>
            <button
              onClick={() => setActiveSection("courseOptions")}
              className="back-btn"
            >
              ← Back to Course Options
            </button>
          </div>
        </div>
      )}

      {/* Coding Lab form */}
      {activeSection === "codingLab" && (
        <div className="form-container coding-lab-form">
          <h2>Add Coding Lab Question</h2>

          <label>
            Topic
            <select
              name="topic"
              value={codingLabForm.topic}
              onChange={handleCodingLabChange}
              required
            >
              <option value="">-- Select Topic --</option>
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label>
            Difficulty Level
            <select
              name="level"
              value={codingLabForm.level}
              onChange={handleCodingLabChange}
              required
            >
              {levels.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>

          <label>
            Problem Description
            <textarea
              name="description"
              value={codingLabForm.description}
              onChange={handleCodingLabChange}
              placeholder="Full problem statement/description"
              rows={5}
              required
            />
          </label>

          <label>
            Example Input
            <textarea
              name="example_input"
              value={codingLabForm.example_input}
              onChange={handleCodingLabChange}
              placeholder="Example Input (e.g., [2,7,11,15], 9)"
              className="code-area"
              rows={2}
            />
          </label>

          <label>
            Example Output
            <textarea
              name="example_output"
              value={codingLabForm.example_output}
              onChange={handleCodingLabChange}
              placeholder="Example Output (e.g., [0,1])"
              className="code-area"
              rows={2}
            />
          </label>

          {/* Solutions Section */}
          <div className="section-divider">
            <h3>Solutions</h3>
            <label>
                Default Language for New Solutions:
                <select
                    value={currentSolutionLanguage}
                    onChange={(e) => setCurrentSolutionLanguage(e.target.value)}
                >
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                </select>
            </label>

            {codingLabForm.solutions.map((sol, index) => (
              <div key={index} className="solution-entry">
                <label>
                  Language
                  <select
                    value={sol.language}
                    onChange={(e) => handleSolutionLanguageChange(index, e.target.value)}
                    required
                  >
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                  </select>
                </label>
                <label>
                  Code
                  <textarea
                    value={sol.code}
                    onChange={(e) => handleSolutionCodeChange(index, e.target.value)}
                    placeholder={`Enter ${sol.language} code here`}
                    className="code-area"
                    rows={8}
                    required
                  />
                </label>
                {codingLabForm.solutions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSolution(index)}
                    className="remove-btn"
                  >
                    Remove Solution
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddSolution} className="add-more-btn">
              ➕ Add Another Solution
            </button>
          </div>

          {/* Test Cases Section */}
          <div className="section-divider">
            <h3>Test Cases</h3>
            {codingLabForm.test_cases.map((tc, index) => (
              <div key={index} className="test-case-entry">
                <label>
                  Input
                  <textarea
                    value={tc.input}
                    onChange={(e) => handleTestCaseChange(index, "input", e.target.value)}
                    placeholder="Test case input"
                    className="code-area"
                    rows={2}
                    required
                  />
                </label>
                <label>
                  Expected Output
                  <textarea
                    value={tc.expected_output}
                    onChange={(e) => handleTestCaseChange(index, "expected_output", e.target.value)}
                    placeholder="Expected test case output"
                    className="code-area"
                    rows={2}
                    required
                  />
                </label>
                {codingLabForm.test_cases.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTestCase(index)}
                    className="remove-btn"
                  >
                    Remove Test Case
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddTestCase} className="add-more-btn">
              ➕ Add Another Test Case
            </button>
          </div>


          <div className="form-buttons">
            <button onClick={submitCodingLab} className="submit-btn">
              Submit Coding Question
            </button>
            <button onClick={() => setActiveSection(null)} className="back-btn">
              ← Back to Main Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}