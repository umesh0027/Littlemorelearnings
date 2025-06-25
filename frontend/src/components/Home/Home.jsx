import React from "react";
import "./Home.css";
import heroLogo from "./assets/logo.png";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Learn More with Little More Learning</h1>
            <p className="hero-subtitle">
              Unlock your potential with our interactive video-based tutorials
              across various subjects. Learn at your own pace, anytime,
              anywhere.
            </p>
            <Link to="/courses">
              <button className="cta-button">
                Explore Courses <span className="button-icon">→</span>
              </button>
            </Link>
          </div>
          <img src={heroLogo} alt="EdTech Logo" className="hero-logo" />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section">
        <div className="section-container">
          <h2 className="section-title">Why Choose Little More Learning?</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎬</div>
              <h3>Video-Based Learning</h3>
              <p>
                Learn through engaging video tutorials that make complex
                concepts easy to understand.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⏱️</div>
              <h3>Learn at Your Pace</h3>
              <p>
                Access content anytime and learn at your own pace with our
                flexible learning platform.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Diverse Subjects</h3>
              <p>
                Explore a wide range of subjects from mathematics to programming
                and beyond.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <h2 className="section-title">Ready to Start Learning?</h2>
          <p className="cta-text">
            Join thousands of students who are already expanding their knowledge
            with Little More Learning.
          </p>
          <Link to="/courses">
            <button className="cta-button secondary">Get Started Today</button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
