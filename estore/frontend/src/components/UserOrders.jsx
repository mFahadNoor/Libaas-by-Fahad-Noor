import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./Navbarwithoutsb.jsx";
import LoadingScreen from "../components/LoadingPage/LoadingPage.jsx";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null); // Product to review
  const [reviewText, setReviewText] = useState(""); // User's review
  const [reviewRating, setReviewRating] = useState(0); // User's rating

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user")); // Retrieving user data
        if (!userData || !userData.id) {
          throw new Error("User not logged in.");
        }

        const userId = userData.id; // Getting the user ID from local storage
        const token = userData.token; // Retrieve the token as well, if needed

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
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleWriteReview = (product) => {
    setReviewProduct(product);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReviewProduct(null);
    setReviewText("");
    setReviewRating(0);
  };

  const submitReview = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user")); // Retrieve user data
      if (!userData || !userData.id) throw new Error("User not logged in");

      const config = {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      };

      const reviewData = {
        userId: userData.id,
        productId: reviewProduct._id,
        review: reviewText,
        rating: reviewRating,
      };

      await axios.post(`http://localhost:5000/api/review/add`, reviewData, config);

      alert("Review submitted successfully!");
      closeReviewModal();
    } catch (err) {
      alert("Failed to submit review. Please try again.");
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    ID
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Total Items
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {order._id}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {order.status === "DELIVERED" ? (
                        <span className="text-green-500">{order.status}</span>
                      ) : (
                        <span className="text-gray-800">{order.status}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {order.orderItems.length}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      <button
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        onClick={() => handleViewDetails(order)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modals */}
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg h-full max-h-screen overflow-y-auto">
              {/* Modal content */}
            </div>
          </div>
        )}
        {isReviewModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              {/* Review modal content */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
