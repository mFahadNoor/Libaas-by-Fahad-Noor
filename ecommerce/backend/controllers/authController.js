const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const crypto = require("crypto"); // For generating a random password
const postmark = require("postmark"); // Postmark SDK
const client = new postmark.ServerClient("e31acd64-1069-4eef-ad00-896377b92059"); // Set your Postmark API Key

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
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  // Generate a random new password
  const newPassword = generateRandomPassword();

  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update user's password with the new hashed password
  user.password = hashedPassword;
  await user.save();

  // Send email with new password using Postmark
  try {
    await client.sendEmail({
      From: "i222435@nu.edu.pk", // Replace with your "From" email
      To: user.email,
      Subject: "Your New Password",
      HtmlBody: `<p>Your new password is: <strong>${newPassword}</strong></p><p>Please change it after logging in.</p>`,
    });

    res.status(200).json({ message: "New password sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending email" });
  }
});

// Generate JWT token
const generateToken = (id) => {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error('JWT secret key is not defined');
  }

  return jwt.sign({ id }, secretKey, {
    expiresIn: "30d",
  });
};

// Function to generate a random password
const generateRandomPassword = () => {
  return crypto.randomBytes(8).toString("hex"); // Generates an 8-character random hex string
};

module.exports = { login, register, forgotPassword };