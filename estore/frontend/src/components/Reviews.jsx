import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbarwithoutsb.jsx";
import LoadingScreen from "./LoadingPage/LoadingPage.jsx";

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedReview, setSelectedReview] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(0);
    const [productInfo, setProductInfo] = useState(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("user"));
                if (!userData || !userData.id) throw new Error("User not logged in.");

                const userId = userData.id;
                const token = userData.token;

                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };

                // Fetch reviews
                const { data: reviewsData } = await axios.get(
                    `http://localhost:5000/api/review/user/${userId}`,
                    config
                );
                setReviews(reviewsData);
                setLoading(false);
            } catch (err) {
                setError("Failed to load data. Please try again.");
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const openEditModal = (review) => {
        setSelectedReview(review);
        setReviewText(review.review);
        setReviewRating(review.rating);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setSelectedReview(null);
        setReviewText("");
        setReviewRating(0);
        setIsEditModalOpen(false);
    };

    const submitEdit = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            const token = userData.token;

            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            const updatedReview = {
                review: reviewText,
                rating: reviewRating,
            };

            await axios.put(
                `http://localhost:5000/api/review/${selectedReview._id}`,
                updatedReview,
                config
            );

            setReviews((prevReviews) =>
                prevReviews.map((review) =>
                    review._id === selectedReview._id ? { ...review, ...updatedReview } : review
                )
            );

            alert("Review updated successfully!");
            closeEditModal();
        } catch (err) {
            alert("Failed to update review. Please try again.");
        }
    };

    const deleteReview = async (reviewId) => {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            const token = userData.token;

            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            await axios.delete(`http://localhost:5000/api/review/delete/${reviewId}`, config);

            setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));

            alert("Review deleted successfully!");
        } catch (err) {
            alert("Failed to delete review. Please try again.");
        }
    };

    const fetchProductDetails = async (productId) => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/products/${productId}`);
            setProductInfo(data);
            setIsProductModalOpen(true);
        } catch (err) {
            alert("Failed to load product details. Please try again.");
        }
    };

    const closeProductModal = () => {
        setProductInfo(null);
        setIsProductModalOpen(false);
    };

    if (loading) return <LoadingScreen />;
    // if (error) return <div>{error}</div>;

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4">Your Reviews</h2>
                {reviews.length === 0 ? (
                    <p>No reviews found.</p>
                ) : (
                    <ul>
                        {reviews.map((review) => (
                            <li key={review._id} className="mb-4 p-4 bg-gray-100 rounded-lg">
                                <p className="text-sm">
                                    Product:{" "}
                                    <span
                                        className="text-blue-500 cursor-pointer underline"
                                        onClick={() => fetchProductDetails(review.productId)}
                                    >
                                        {review.productId}
                                    </span>
                                </p>
                                <p className="text-sm">Review: {review.review}</p>
                                <p className="text-sm">Rating: {review.rating}</p>
                                <div className="mt-2">
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded-lg mr-2"
                                        onClick={() => openEditModal(review)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded-lg"
                                        onClick={() => deleteReview(review._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h3 className="text-xl font-bold mb-4">Edit Review</h3>
                            <textarea
                                className="w-full p-2 border rounded mb-4"
                                placeholder="Edit your review"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                            />
                            <div className="mb-4">
                                <label className="block mb-1">Rating:</label>
                                <input
                                    type="number"
                                    max="5"
                                    min="1"
                                    value={reviewRating}
                                    onChange={(e) => setReviewRating(Number(e.target.value))}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                                    onClick={submitEdit}
                                >
                                    Submit
                                </button>
                                <button
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                                    onClick={closeEditModal}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isProductModalOpen && productInfo && (
                   <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                   <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                       <h3 className="text-xl font-bold mb-4">Product Details</h3>
                       <p><strong>Name:</strong> {productInfo.name}</p>
                       <p><strong>Price:</strong> ${productInfo.price}</p>
                       <img
                           src={productInfo.image}
                           alt={productInfo.name}
                           className="w-full h-auto rounded-lg mb-4"
                       />
                       <button
                           className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg"
                           onClick={closeProductModal}
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

export default Reviews;
