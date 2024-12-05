const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.route("/").post(protect, createOrder).get(protect, getMyOrders);
router.route("/all").get(protect, authorize("ADMIN"), getAllOrders);
router.route("/:id").get(protect, getOrderById);

router
  .route("/:id/status")
  .put(protect, authorize("SELLER"), updateOrderStatus);

module.exports = router;
