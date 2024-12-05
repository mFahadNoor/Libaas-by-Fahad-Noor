const express = require("express");
const router = express.Router();
const {
  getSalesAnalytics,
  getOrderAnalytics,
} = require("../controllers/adminAnalyticsController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("ADMIN"));

router.get("/sales", getSalesAnalytics);
router.get("/orders", getOrderAnalytics);

module.exports = router;
