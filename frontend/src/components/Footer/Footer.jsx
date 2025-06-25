import React, { useState } from "react";
import { FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I access my courses?",
      answer:
        "After signing up, all your courses will be available in your dashboard.",
    },
    {
      question: "Can I download videos?",
      answer:
        "Yes, our premium plans allow video downloads for offline viewing.",
    },
    {
      question: "How do I reset my password?",
      answer:
        "Click 'Forgot Password' on the login page to receive reset instructions.",
    },
  ];

  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-about">
          <h3>About Us</h3>
          <p>
            Little More Learning is an educational platform dedicated to
            providing high-quality video tutorials across various subjects.
          </p>
        </div>

        <div className="footer-links">
          <div className="links-column">
            <h4>FAQ</h4>
            <ul>
              {faqs.map((faq, index) => (
                <li
                  key={index}
                  className={`faq-item ${activeFaq === index ? "active" : ""}`}
                  onClick={() => toggleFaq(index)}
                >
                  <span className="faq-question">{faq.question}</span>
                  <div className="faq-answer">{faq.answer}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="links-column">
            <h4>Contact Us</h4>
            <ul>
              <li className="contact-link">support@littlemorelearning.com</li>
              <li className="contact-link">+1 (555) 123-4567</li>
            </ul>
          </div>

          <div className="links-column">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a
                href="https://www.youtube.com/channel/UCJwv5ry0atyVjBRMLT4szZg"
                className="social-icon"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube />
              </a>
              <a
                href="https://www.instagram.com/littlemorelearning/?__pwa=1"
                className="social-icon"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.linkedin.com/company/little-more-learning/"
                className="social-icon"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Little More Learning. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
