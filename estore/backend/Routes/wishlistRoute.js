const express = require("express");
const { addToWishlist } = require("../controllers/wishlistController");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware.js"); // Protect route using authentication

// Route to add product to wishlist
router.post("/add", addToWishlist);

module.exports = router;
