const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

// @desc    Get sales analytics
// @route   GET /api/analytics/sales
// @access  Private/Admin
const getSalesAnalytics = asyncHandler(async (req, res) => {
  const { period = "monthly" } = req.query;

  const currentDate = new Date();
  const startDate = new Date();

  // Adjust date range based on period
  if (period === "monthly") {
    startDate.setMonth(startDate.getMonth() - 6);
  } else if (period === "weekly") {
    startDate.setDate(startDate.getDate() - 28); // Last 4 weeks
  }

  // Generate date array for the selected period
  const dateArray = [];
  const tempDate = new Date(startDate);
  while (tempDate <= currentDate) {
    dateArray.push(new Date(tempDate));
    if (period === "monthly") {
      tempDate.setMonth(tempDate.getMonth() + 1);
    } else {
      tempDate.setDate(tempDate.getDate() + 1);
    }
  }

  const salesData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: currentDate },
        status: { $ne: "CANCELLED" },
      },
    },
    {
      $unwind: "$orderItems",
    },
    {
      $lookup: {
        from: "products",
        localField: "orderItems.product",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: period === "monthly" ? "%Y-%m" : "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        sales: {
          $sum: { $multiply: ["$orderItems.quantity", "$product.price"] },
        },
        orders: { $addToSet: "$_id" },
        products: { $sum: "$orderItems.quantity" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Fill in missing dates with zero values
  const formattedSalesData = dateArray.map((date) => {
    const dateStr =
      period === "monthly"
        ? date.toISOString().substring(0, 7)
        : date.toISOString().substring(0, 10);

    const existingData = salesData.find((item) => item._id === dateStr);

    return (
      existingData || {
        _id: dateStr,
        sales: 0,
        orders: [],
        products: 0,
      }
    );
  });

  // Calculate key metrics
  const totalOrders = await Order.countDocuments({
    createdAt: { $gte: startDate, $lte: currentDate },
    status: { $ne: "CANCELLED" },
  });

  const totalCustomers = await User.countDocuments({
    role: "CUSTOMER",
    createdAt: { $gte: startDate, $lte: currentDate },
  });

  const averageOrderValue = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: currentDate },
        status: { $ne: "CANCELLED" },
      },
    },
    {
      $unwind: "$orderItems",
    },
    {
      $lookup: {
        from: "products",
        localField: "orderItems.product",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: { $multiply: ["$orderItems.quantity", "$product.price"] },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        averageValue: { $divide: ["$total", "$count"] },
      },
    },
  ]);

  // Get category distribution
  const categoryDistribution = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: currentDate },
        status: { $ne: "CANCELLED" },
      },
    },
    {
      $unwind: "$orderItems",
    },
    {
      $lookup: {
        from: "products",
        localField: "orderItems.product",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $group: {
        _id: "$product.category",
        count: { $sum: "$orderItems.quantity" },
      },
    },
  ]);

  res.json({
    salesData: formattedSalesData,
    metrics: {
      totalOrders,
      totalCustomers,
      averageOrderValue: averageOrderValue[0]?.averageValue || 0,
      categoryDistribution,
    },
  });
});

// @desc    Get order status analytics
// @route   GET /api/analytics/orders
// @access  Private/Admin
const getOrderAnalytics = asyncHandler(async (req, res) => {
  const orderStatusCount = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  res.json(orderStatusCount);
});

module.exports = {
  getSalesAnalytics,
  getOrderAnalytics,
};
