const protect = (req, res, next) => {
    // Placeholder for authentication logic
    // Allow all requests for now
    next();
  };
  
  module.exports = { protect };
  