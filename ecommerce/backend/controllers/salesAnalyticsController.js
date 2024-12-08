const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Fetch sales trends (daily/monthly)
const getSalesTrends = async (req, res) => {
  try {
    const sellerID = "64eabb7e0d1e490001a0c123";

    if (!mongoose.Types.ObjectId.isValid(sellerID)) {
      return res.status(400).json({ message: "Invalid sellerID format" });
    }

    const sellerObjectId = new mongoose.Types.ObjectId(sellerID);

    // Debug: Check orders with their status and timestamps
    const allOrders = await Order.find({ sellerID: sellerObjectId });
    console.log('All orders status breakdown:', 
      allOrders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {})
    );

    // Debug: Check the first stage of aggregation
    const matchedOrders = await Order.aggregate([
      {
        $match: {
          sellerID: sellerObjectId,
          status: { $in: ['Shipped', 'Delivered'] }
        }
      }
    ]);
    console.log('Orders after status match:', matchedOrders.length);

    const salesTrends = await Order.aggregate([
      {
        $match: {
          sellerID: sellerObjectId,
          status: { $in: ['Shipped', 'Delivered'] }
        }
      },
      {
        $addFields: {
          yearMonth: {
            $dateToString: { 
              format: "%Y-%m", 
              date: { $toDate: "$_id" }  // Use ObjectId timestamp if createdAt is missing
            }
          }
        }
      },
      {
        $group: {
          _id: "$yearMonth",
          totalSales: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    res.json({ salesTrends });
  } catch (err) {
    console.error("Error fetching sales trends:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

   

  

// Fetch product performance metrics
const getProductPerformance = async (req, res) => {
  try {
    const sellerID = "64eabb7e0d1e490001a0c123";

    if (!mongoose.Types.ObjectId.isValid(sellerID)) {
      return res.status(400).json({ message: "Invalid sellerID format" });
    }

    const sellerObjectId = new mongoose.Types.ObjectId(sellerID);

    const productPerformance = await Product.aggregate([
      { 
        $match: { sellerID: sellerObjectId } 
      },
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

    if (!productPerformance) {
      return res.status(404).json({ message: "No products found" });
    }

    res.json({ productPerformance });
  } catch (err) {
    console.error("Error fetching product performance:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getSalesTrends, getProductPerformance };
