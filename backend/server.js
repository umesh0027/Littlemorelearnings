// edtech-backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const nodemailer = require("nodemailer"); // Keep this if you have contact form sending email

// Import routes
const courseRoutes = require("./routes/courseRoutes");
const codingProblemRoutes = require("./routes/codingProblemRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes"); // NEW: Admin Auth Routes

const app = express();
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// NEW: Configure Nodemailer transporter (if applicable for contact form)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Use routes
app.use("/api/courses", courseRoutes);
app.use("/api/codingproblems", codingProblemRoutes);
app.use("/api/admin", adminAuthRoutes); // NEW: Admin Auth Routes

// Contact Form API Route (keep existing if you want)
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }
  if (!email.includes("@") || !email.includes(".")) {
    return res
      .status(400)
      .json({ message: "Please enter a valid email address." });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Contact Message from ${name}`,
    html: `
      <p>You have a new contact message:</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Message:</strong><br>${message.replace(/\n/g, "<br>")}</li>
      </ul>
      <p>---<br>Sent from your EdTech Contact Form</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ message: "Failed to send message. Please try again later." });
  }
});

// Basic route
app.get("/", (req, res) => {
  res.send("EdTech Backend API is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
