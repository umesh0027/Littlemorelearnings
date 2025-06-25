// edtech-frontend/src/components/Contact/Contact.jsx
import React, { useState } from "react";
import "./Contact.css";
import axios from "axios"; // Import axios if not already present

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // Make the function async
    e.preventDefault();
    setErrorMsg("");
    setSuccess(false);

    // Basic client-side validation
    if (!formData.email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!formData.name.trim() || !formData.message.trim()) {
      setErrorMsg("Please fill in all the required fields.");
      return;
    }

    setLoading(true);

    try {
      // Send data to your backend API
      const response = await axios.post(
        // "http://localhost:5000/api/contact",
        `${process.env.REACT_APP_BASE_URL}/contact`,
        formData
      );

      // Check for success response from backend
      if (response.status === 200) {
        // Assuming backend sends 200 OK on success
        setSuccess(true);
        setFormData({ name: "", email: "", message: "" }); // Clear form
      } else {
        // This else might not be hit if axios throws an error for non-2xx status,
        // but it's good for explicit checks
        setErrorMsg(
          response.data.message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      // Handle different types of errors (network, server, validation from backend)
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setErrorMsg(
          error.response.data.message ||
            "A server error occurred. Please try again."
        );
      } else if (error.request) {
        // The request was made but no response was received
        setErrorMsg(
          "No response from server. Please check your internet connection."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        setErrorMsg("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        <h2 className="section-title">Contact Us</h2>
        <p className="section-subtitle">We’d love to hear from you!</p>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
              placeholder="Write your message here..."
            />
          </div>
          {errorMsg && <p className="error-message">{errorMsg}</p>}
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
        {success && (
          <div className="success-message">
            <span className="success-icon">✅</span> Message sent successfully!
          </div>
        )}
      </div>
    </section>
  );
}
