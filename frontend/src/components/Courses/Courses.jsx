// edtech-frontend/src/components/Courses/Courses.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Courses.css";

const categories = [
  "All Subjects",
  "Mathematics",
  "Science",
  "Programming",
  "Languages",
  "Arts",
];

export default function Courses() {
  const [selectedCategory, setSelectedCategory] = useState("All Subjects");
  const [courseData, setCourseData] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/courses`)

      .then((res) => setCourseData(res.data))
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  const filteredCourses =
    selectedCategory === "All Subjects"
      ? courseData
      : courseData.filter((course) => course.category === selectedCategory);

  return (
    <div className="courses-page">
      <div className="courses-header">
        <h1>Explore Our Courses</h1>
        <p>Discover a wide range of video tutorials across various subjects</p>
        <div className="category-filters">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className={`filter-btn ${
                selectedCategory === cat ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="courses-grid">
        {filteredCourses.map((course) => (
          <div key={course._id} className="course-card">
            <div className={`card-top ${course.category.toLowerCase()}`}>
              <span className="course-icon">{course.icon}</span>
            </div>
            <div className="card-bottom">
              <span className={`course-tag ${course.category.toLowerCase()}`}>
                {course.category}
              </span>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="course-meta">
                {course.videos} videos • {course.duration}
              </div>
              <Link to={`/courses/${course._id}`} className="view-course">
                View Course
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
