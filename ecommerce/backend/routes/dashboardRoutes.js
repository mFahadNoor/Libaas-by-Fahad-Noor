const express = require("express");
const router = express.Router();
const { getDashboardData } = require("../controllers/dashboardController");
const { getAlerts } = require("../controllers/alertsController");

// Route to fetch dashboard data
router.get("/dashboard", getDashboardData);

// Route to fetch alerts
router.get("/alerts", getAlerts);

module.exports = router;
