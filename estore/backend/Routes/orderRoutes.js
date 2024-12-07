const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getOrdersByUserId} = require("../controllers/orderController.js");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/",createOrder)
router.get("/get",getMyOrders);
router.route("/all").get(protect, authorize("ADMIN"), getAllOrders);
router.get('/:id', protect, getOrderById);
router.get("/user/:userId", getOrdersByUserId);

router
  .route("/:id/status")
  .put(protect, authorize("SELLER"), updateOrderStatus);

module.exports = router;