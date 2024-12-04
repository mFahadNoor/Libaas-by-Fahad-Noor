const express = require("express");
const router = express.Router();
const {
  getCart,
  addItemToCart,
  removeItemFromCart,
  clearCart,
  createCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

// Protect all routes with authentication middleware
router.post("/create", protect, createCart);
router.get("/", protect, getCart);
router.post("/", protect, addItemToCart);
router.delete("/:productId", protect, removeItemFromCart);
router.delete("/", protect, clearCart);

module.exports = router;
