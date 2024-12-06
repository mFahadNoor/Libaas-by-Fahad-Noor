const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/orderController.js");
const { protect, authorize } = require("../middleware/authMiddleware");

router.route("/").post( createOrder).get(getMyOrders);
router.route("/all").get(protect, authorize("ADMIN"), getAllOrders);
router.route("/:id").get(protect, getOrderById);

router
  .route("/:id/status")
  .put(protect, authorize("SELLER"), updateOrderStatus);

module.exports = router;