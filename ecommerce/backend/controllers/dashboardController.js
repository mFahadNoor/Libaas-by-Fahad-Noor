const Product = require('../models/Product');
const Order = require('../models/Order');
const mongoose = require('mongoose');

// Fetch dashboard data
const getDashboardData = async (req, res) => {
    try {
        const sellerID = "64eabb7e0d1e490001a0c123";
        const sellerObjectId = new mongoose.Types.ObjectId(sellerID);

        // 1. Total Revenue and Monthly Revenue
        const revenueStats = await Order.aggregate([
            { $match: { sellerID: sellerObjectId, status: { $in: ['Shipped', 'Delivered'] } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    monthlyRevenue: { $sum: "$totalAmount" }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$monthlyRevenue" },
                    monthlyBreakdown: { $push: { month: "$_id", revenue: "$monthlyRevenue" } }
                }
            }
        ]);

        // 2. Order Statistics
        const orderStats = await Order.aggregate([
            { $match: { sellerID: sellerObjectId } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // 3. Product Performance
        const productPerformance = await Product.aggregate([
            { $match: { sellerID: sellerObjectId } },
            {
                $lookup: {
                    from: "orders",
                    let: { productId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$sellerID", sellerObjectId] },
                                        { $in: [{ $toString: "$$productId" }, "$productIDs"] },
                                        { $in: ["$status", ["Shipped", "Delivered"]] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "productOrders"
                }
            },
            {
                $addFields: {
                    salesCount: {
                        $reduce: {
                            input: "$productOrders",
                            initialValue: 0,
                            in: { $add: ["$$value", "$$this.quantity"] }
                        }
                    },
                    revenue: {
                        $reduce: {
                            input: "$productOrders",
                            initialValue: 0,
                            in: { 
                                $add: [
                                    "$$value",
                                    { $multiply: ["$price", "$$this.quantity"] }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    name: 1,
                    price: 1,
                    stock: 1,
                    salesCount: 1,
                    revenue: 1,
                    debugProductOrders: "$productOrders",
                    debugFilteredOrders: []
                }
            }
        ]);

        // Return the results
        res.json({
            revenueStats: revenueStats.length > 0 ? revenueStats[0] : { totalRevenue: 0, monthlyBreakdown: [] },
            orderStats,
            productPerformance
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { getDashboardData };