const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// Token protection middleware
const protect = async (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    ? req.headers.authorization.split(" ")[1]
    : null;

  console.log("Token:", token); // Debug log

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Verify the token using JWT_SECRET from the environment
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debug log

    // Attach the user details from the decoded token to the request object
    req.user = {
      _id: decoded.user.id,
      role: decoded.user.role || "USER", // Default to "USER" if no role is provided
    };

    next();
  } catch (error) {
    console.error("Token Verification Error:", error.message); // Debug log
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Role-based access control middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Export both functions
module.exports = {
  protect,
  authorize,
};
