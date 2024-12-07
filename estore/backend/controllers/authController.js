const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

// Register user
const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, role } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name: fullName,
    email,
    password: hashedPassword,
    role: role.toUpperCase(),
  });

  if (user) {
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Login user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// Generate JWT token
const generateToken = (id) => {
  const secretKey = process.env.JWT_SECRET;
console.log(secretKey);
  if (!secretKey) {
    throw new Error('JWT secret key is not defined');
  }

  return jwt.sign({ id }, secretKey, {
    expiresIn: "30d",
  });
};

module.exports = { login, register };
