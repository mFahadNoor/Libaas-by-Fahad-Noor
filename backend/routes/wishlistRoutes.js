const express = require("express");
const router = express.Router();
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, addToWishlist).get(protect, getWishlist);

router.route("/:productId").delete(protect, removeFromWishlist);

module.exports = router;
