const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const jwt = require('jsonwebtoken');

const createOrder = asyncHandler(async (req, res) => {
  const { user,orderItems } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }
  const order = await Order.create({
    user,
    orderItems,
  });

  res.status(201).json(order);
});

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    "orderItems.product"
  );
  res.json(orders);
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("orderItems.product") // Populate product details for each order item
    .populate("user");
  res.json(orders);
});


const getOrdersByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Ensure only admins or the user themselves can access this


  // Fetch all orders for the specific user
  const orders = await Order.find({ user: userId }).populate("orderItems.product");

  if (!orders || orders.length === 0) {
    return res.status(404).json({ message: "No orders found for this user" });
  }

  res.json(orders);
});

module.exports = {
  getOrdersByUserId,
};


// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const order = await Order.findById(req.params.id).populate(
    "orderItems.product"
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Check if order belongs to user or user is admin
  if (
    order.user.toString() !== req.user._id.toString() &&
    req.user.role !== "ADMIN"
  ) {
    res.status(403);
    throw new Error("Not authorized to access this order");
  }

  res.json(order);
});


// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.status = status;
  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getOrdersByUserId,
};