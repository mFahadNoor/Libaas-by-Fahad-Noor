const express = require('express');
const {
  getOrders,
  updateOrderStatus,
  bulkUpdateOrderStatus,
  getOrderById,
} = require('../controllers/orderController');

const router = express.Router();

router.get('/orders', getOrders);        // Fetch all orders
router.get('/orders/:id', getOrderById); // Fetch order by ID
router.put('/orders/:id', updateOrderStatus); // Update single order
router.put('/orders', bulkUpdateOrderStatus); // Bulk update orders

module.exports = router;


module.exports = router;
