const Order = require('../models/Order');
const mongoose = require('mongoose');

// Fetch all orders for a seller
const getOrders = async (req, res) => {
  try {
    const sellerID = "64eabb7e0d1e490001a0c123"; // Mock seller ID
    const orders = await Order.find({ sellerID: new mongoose.Types.ObjectId(sellerID) });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this seller" });
    }

    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
};



// Fetch order details by ID
const { isValidObjectId } = mongoose;

const getOrderById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid Order ID" });
  }

  try {
    const order = await Order.findById(id).populate("productIDs");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update the status of an order
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Bulk update order statuses
const bulkUpdateOrderStatus = async (req, res) => {
  const { orders } = req.body; // Array of order IDs and their statuses

  try {
    const updatePromises = orders.map(order =>
      Order.findByIdAndUpdate(order.id, { status: order.status }, { new: true })
    );

    const updatedOrders = await Promise.all(updatePromises);

    res.json(updatedOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getOrders, getOrderById, updateOrderStatus, bulkUpdateOrderStatus };
