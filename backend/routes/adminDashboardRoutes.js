const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getAdminDashboardStats,
} = require("../controllers/adminDashboardController");

// Protected route for fetching dashboard stats
router.route("/stats").get(protect, authorize("ADMIN"), getAdminDashboardStats);

module.exports = router;
