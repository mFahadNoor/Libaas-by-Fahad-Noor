const express = require("express");
const router = express.Router();
const { getSalesTrends, getProductPerformance } = require("../controllers/salesAnalyticsController");

// Sales trends endpoint
router.get("/sales", getSalesTrends);

// Product performance endpoint
router.get("/products/performance", getProductPerformance);

module.exports = router;
