// edtech-backend/routes/adminAuthRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser"); // Adjust path if necessary

// Function to generate JWT (could be in a utils file too)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token expires in 1 hour
  });
};

// @route   POST /api/admin/login
// @desc    Authenticate admin user & get token
// @access  Public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if admin user exists
    const adminUser = await AdminUser.findOne({ username });

    if (!adminUser) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // Check password
    const isMatch = await adminUser.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // If credentials match, generate token
    const token = generateToken(adminUser._id);

    res.json({
      _id: adminUser._id,
      username: adminUser.username,
      role: adminUser.role,
      token,
      message: "Login successful!",
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Optional: Add a route to create a default admin user (RUN ONCE ONLY!)
// This is for initial setup. In production, you'd have a more secure way to onboard admins.
router.post("/register-first-admin", async (req, res) => {
  const { username, password } = req.body; // Expect username and password in body

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username and password." });
  }

  try {
    const existingAdmin = await AdminUser.findOne({ username });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin username already exists." });
    }

    const newAdmin = new AdminUser({ username, password });
    await newAdmin.save();

    res.status(201).json({ message: "First admin user created successfully!" });
  } catch (error) {
    console.error("Error creating first admin:", error);
    res.status(500).json({ message: "Server error creating admin." });
  }
});

module.exports = router;
