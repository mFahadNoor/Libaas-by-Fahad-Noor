const Product = require('../models/Product');
const Order = require('../models/Order');
const mongoose = require('mongoose');

// Fetch alerts for low stock and pending orders
const getAlerts = async (req, res) => {
    try {
      // Temporary hardcoded sellerID for testing purposes
      const sellerID = "64eabb7e0d1e490001a0c123";
  
      // Validate sellerID
      if (!mongoose.Types.ObjectId.isValid(sellerID)) {
        return res.status(400).json({ message: "Invalid sellerID format" });
      }
  
      // Convert sellerID to ObjectId
      const sellerObjectId = new mongoose.Types.ObjectId(sellerID);
  
      // Fetch low-stock products
      const lowStockProducts = await Product.find({ sellerID: sellerObjectId, stock: { $lt: 5 } }).select("name stock");
  
      // Fetch pending orders
      const pendingOrders = await Order.find({ sellerID: sellerObjectId, status: "Pending" }).select("customerDetails totalAmount status");
  
      res.json({
        lowStockProducts,
        pendingOrders,
      });
    } catch (err) {
      console.error("Error fetching alerts:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  

module.exports = { getAlerts };
