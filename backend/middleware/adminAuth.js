// edtech-backend/middleware/adminAuth.js
const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  // Get token from header
  // The token is usually sent as 'Bearer TOKEN_STRING'
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token
    // Replace process.env.JWT_SECRET with your actual secret key
    // (You should have this defined in your .env file)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach admin payload to request
    // This will make req.admin available in your route handlers
    req.admin = decoded;
    next(); // Move to the next middleware/route handler
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = adminAuth;
