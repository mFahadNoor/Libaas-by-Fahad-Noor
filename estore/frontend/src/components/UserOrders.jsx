import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom"; // Import Link for navigation
import Navbar from "./Navbarwithoutsb.jsx";
import LoadingScreen from "../components/LoadingPage/LoadingPage.jsx";
const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // To store selected order details
  const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User not logged in.");
        }

        const decoded = jwtDecode(token);
        const userId = decoded.user.id;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.get(
          `http://localhost:5000/api/order/user/${userId}`,
          config
        );
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load orders. Please try again.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleViewDetails = (order) => {
    console.log(order); // Log the order data to check its structure
    setSelectedOrder(order);
    setIsModalOpen(true); // Open modal when "View Details" is clicked
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedOrder(null); // Clear the selected order
  };

  if (loading) return <LoadingScreen />; // Show loading screen while fetching data

  if (error) return <div>{error}</div>;

  return (
    <div>
        <Navbar/>
    <div className="max-w-7xl mx-auto px-4 py-8">
        
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Order ID</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Total Items</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="py-3 px-4 text-sm text-gray-800">{order._id}</td>
                <td className="py-3 px-4 text-sm text-gray-800">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-sm text-gray-800">{order.status}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{order.orderItems.length}</td>
                <td className="py-3 px-4 text-sm text-gray-800">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={() => handleViewDetails(order)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for viewing order details */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 h-96 flex flex-col">

            <h3 className="text-2xl font-bold mb-4">Order Details</h3>
            <div className="mb-4">
              <p className="font-medium text-sm">Order ID: {selectedOrder._id}</p>
              <p className="font-medium text-sm">Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
              <p className="font-medium text-sm">Status: {selectedOrder.status}</p>
            </div>

            <h4 className="font-semibold mb-2">Order Items:</h4>
            <div className="overflow-y-auto flex-1" style={{ maxHeight: "calc(100% - 150px)" }}>
              {/* Make sure the content scrolls if it exceeds the available space */}
              <ul className="mb-4">
                {selectedOrder.orderItems.map((item, index) => (
                  <li key={index} className="flex items-center space-x-4 mb-2">
                    <Link to={`/products/${item.product?._id}`}>
                      <img
                        src={item.product?.image || "/default-image.png"} // Use default image if no image is available
                        alt={item.product?.name || "Product"}
                        className="h-16 w-16 object-cover rounded-md"
                      />
                    </Link>
                    <div className="flex flex-col">
                      <span className="text-sm">{item.product?.name || "Unknown Product"}</span>
                      <span className="text-sm">Quantity: {item.quantity}</span>
                      <span className="text-sm">Price: ${item.product?.price || "0.00"}</span>
                      <span className="text-sm font-semibold">
                        Total: ${item.product?.price * item.quantity || "0.00"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default UserOrders;
