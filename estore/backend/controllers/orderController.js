const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const sendEmail = require("../config/mailgun");
const postmark = require("postmark");
const Product = require("../models/productModel"); // Ensure you import the Product model

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const jwt = require('jsonwebtoken');
const client = new postmark.ServerClient("e31acd64-1069-4eef-ad00-896377b92059");

const createOrder = asyncHandler(async (req, res) => {
  const { user, orderItems } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  // Find the user by ID to get their email
  const userRecord = await User.findById(user);
  if (!userRecord) {
    res.status(404);
    throw new Error("User not found");
  }

  // Create the order
  const order = await Order.create({ user, orderItems });
  res.status(201).json(order);

  // Send order confirmation email
  const userEmail = userRecord.email;
  const subject = "Order Confirmation";
  const body = `Thank you for your order! Your order has been confirmed. Order ID: ${order._id}`;
  client.sendEmail({
    From: "i222435@nu.edu.pk",
    To: userEmail,
    Subject: subject,
    TextBody: body,
    HtmlBody: `<html><body><h1>${body}</h1></body></html>`,
  }, (error) => {
    if (error) {
      console.error("Error sending email:", error);
    }
  });

  // Process stock updates and notify users if a product goes out of stock
  for (const item of orderItems) {
    const product = await Product.findById(item.product); // Fetch the product
    if (!product) continue;

    product.stock -= item.quantity; // Update stock
    if (product.stock <= 0) {
      product.stock = 0; // Ensure stock does not go negative
      await product.save();

      // Notify users with this product in their wishlist
      const usersToNotify = await User.find({ wishlist: product._id });
      if (usersToNotify.length > 0) {
        const emailPromises = usersToNotify.map((user) => {
          const emailBody = `
            <h1>Product Out of Stock</h1>
            <p>The product "${product.name}" is now out of stock. We will notify you if it becomes available again.</p>
          `;
          return client.sendEmail({
            From: "i222435@nu.edu.pk",
            To: user.email,
            Subject: `Product Out of Stock: ${product.name}`,
            TextBody: `The product "${product.name}" is now out of stock.`,
            HtmlBody: emailBody,
          });
        });

        await Promise.all(emailPromises); // Send all emails concurrently
        console.log(`Notification emails sent for product: ${product.name}`);
      }
    } else {
      await product.save(); // Save changes if stock is not zero
    }
  }
});



// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    "orderItems.product"
  );
  res.json(orders);
  const userEmail = "abdullahjamil2003y@gmail.com"; // Assuming the email is part of the logged-in user object
  const subject = "Order Confirmation";
  const body = `Thank you for your order! Your order has been confirmed. Order ID: ${order._id}`;
  
  // Call the function to send email
  sendEmail(userEmail, subject, body);
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