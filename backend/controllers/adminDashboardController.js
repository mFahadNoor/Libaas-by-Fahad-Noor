const Order = require("../models/orderModel");
const User = require("../models/userModel");

const getAdminDashboardStats = async (req, res) => {
  try {
    // Total Sales (sum of delivered orders)
    const totalSales = await Order.aggregate([
      { $match: { status: "DELIVERED" } },
      { $unwind: "$orderItems" },
      {
        $lookup: {
          from: "products", // Name of the Product collection in MongoDB
          localField: "orderItems.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: {
              $multiply: ["$orderItems.quantity", "$productDetails.price"],
            },
          },
        },
      },
    ]);

    const totalSalesAmount = totalSales[0] ? totalSales[0].totalSales : 0;

    // Active Orders (count of orders in 'PENDING' or 'PROCESSING')
    const activeOrdersCount = await Order.countDocuments({
      status: { $in: ["PENDING", "PROCESSING"] },
    });

    // Total Customers (unique users who placed orders)
    const totalCustomersCount = await User.countDocuments();

    const totalOrders = await Order.countDocuments();

    // Recent Activity (latest orders)
    const recentOrders = await Order.find()
      .sort({ placementDate: -1 })
      .limit(3)
      .populate("user", "name")
      .populate("orderItems.product", "price"); // Populate product details (price) for each order item

    // Send response with stats
    res.json({
      totalSales: totalSalesAmount,
      activeOrders: activeOrdersCount,
      totalCustomers: totalCustomersCount,
      totalOrders: totalOrders,
      recentOrders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAdminDashboardStats };
