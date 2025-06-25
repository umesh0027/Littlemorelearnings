// edtech-backend/models/AdminUser.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Will use for password hashing

const AdminUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    // Can be used for different admin roles if needed later
    type: String,
    default: "admin",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving the user
AdminUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
AdminUserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const AdminUser = mongoose.model("AdminUser", AdminUserSchema);

module.exports = AdminUser;
