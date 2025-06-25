// App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Universal Components
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

// Pages
import Home from "./components/Home/Home";
import Contact from "./components/Contact/Contact";
import Courses from "./components/Courses/Courses";
import CourseDetail from "./components/Courses/CourseDetail"; // Single Course View
import CodingProblems from "./components/CodingLab/CodingProblems";
import ProblemDetail from "./components/CodingLab/ProblemDetail";

import AdminPanel from "./components/AdminPanel";

function App() {
  return (
    <Router>
      <div className="app">
        {/* Persistent Navbar */}
        <Navbar />

        {/* Main Routing Layer */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/coding-lab" element={<CodingProblems />} />
            <Route path="/coding-lab/:problemId" element={<ProblemDetail />} />
            <Route path="/superuser-romsha-portal" element={<AdminPanel />} />
            {/* Future route slots can be added here */}
          </Routes>
        </main>

        {/* Persistent Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
