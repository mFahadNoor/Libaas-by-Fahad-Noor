import React, { useState, useEffect } from "react";
import axios from "axios";

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOption, setSortOption] = useState("");

  const calculateTotal = (orderItems) => {
    return orderItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  };

  // Function to fetch orders
  const fetchOrders = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;

      if (!token) {
        console.error("No token found in localStorage");
        return;
      }
      const response = await axios.get("http://localhost:5000/api/orders/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle Status Filter
  const handleStatusFilterChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);

    // Filter orders based on selected status
    if (value === "") {
      setFilteredOrders(orders); // Show all orders
    } else {
      setFilteredOrders(orders.filter((order) => order.status === value));
    }
  };

  // Handle Sorting
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOption(value);

    let sortedOrders = [...filteredOrders];

    if (value === "dateAsc") {
      sortedOrders.sort(
        (a, b) => new Date(a.placementDate) - new Date(b.placementDate)
      );
    } else if (value === "dateDesc") {
      sortedOrders.sort(
        (a, b) => new Date(b.placementDate) - new Date(a.placementDate)
      );
    } else if (value === "totalAsc") {
      sortedOrders.sort(
        (a, b) => calculateTotal(a.orderItems) - calculateTotal(b.orderItems)
      );
    } else if (value === "totalDesc") {
      sortedOrders.sort(
        (a, b) => calculateTotal(b.orderItems) - calculateTotal(a.orderItems)
      );
    }

    setFilteredOrders(sortedOrders);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-800";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Order Management</h1>

      {/* Filters */}
      <div className="mb-4 flex space-x-4">
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">Filter Status</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        {/* Sorting Options */}
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">Sort By</option>
          <option value="dateAsc">Date (Oldest First)</option>
          <option value="dateDesc">Date (Newest First)</option>
          <option value="totalAsc">Total (Lowest First)</option>
          <option value="totalDesc">Total (Highest First)</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {order._id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {order.user ? order.user.name : "Unknown User"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(order.placementDate).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  ${calculateTotal(order.orderItems).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderManagement;
