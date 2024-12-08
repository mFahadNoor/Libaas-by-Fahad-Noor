import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";

function Dashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    activeOrders: 0,
    totalCustomers: 0,
    recentOrders: [],
  });

  // Fetch dashboard stats from the backend
  const fetchStats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/adminDashboard/stats",
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("user"))?.token
            }`,
          },
        }
      );
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard stats", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []); // Fetch stats on component mount

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <DollarSign size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Total Sales</h3>
          <p className="text-2xl font-bold">${stats.totalSales.toFixed(3)}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <ShoppingBag size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Active Orders</h3>
          <p className="text-2xl font-bold">{stats.activeOrders}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Users size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Total Customers</h3>
          <p className="text-2xl font-bold">{stats.totalCustomers}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <TrendingUp size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Total Orders</h3>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {stats.recentOrders.map((order) => {
            const totalPrice = order.orderItems.reduce(
              (sum, item) => sum + item.product.price * item.quantity,
              0
            );

            return (
              <div
                key={order._id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">New order #{order._id}</p>
                  <p className="text-sm text-gray-600">
                    {order.orderItems.length}{" "}
                    {order.orderItems.length > 1 ? "items" : "item"} • $
                    {totalPrice.toFixed(2)}
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(order.placementDate).toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
