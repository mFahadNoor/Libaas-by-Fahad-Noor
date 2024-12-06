import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    const fetchWishlistAndCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('User not logged in');
        }

        // Decode the token to get the user ID
        const decoded = jwtDecode(token);
        const userId = decoded.user.id;

        // Fetch wishlist data for the user
        const wishlistResponse = await axios.get(`http://localhost:5000/api/wishlist/${userId}`);
        setWishlist(wishlistResponse.data.wishlist || []);

        // Fetch cart data for the user
        const cartResponse = await axios.get(`http://localhost:5000/api/cart/view?user=${userId}`);
        setCartItems(cartResponse.data.cart.items || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistAndCart();
  }, []); // This effect runs only once when the component is mounted

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not logged in');
      }

      // Decode the token to get the user ID
      const decoded = jwtDecode(token);
      const userId = decoded.user.id;

      // Send the correct userId and productId to the backend via POST
      await axios.post('http://localhost:5000/api/wishlist/remove', {
        user: userId,  // Send user ID
        productId: productId, // Send product ID
      });

      // Update the wishlist after successful removal
      setWishlist(wishlist.filter((item) => item._id !== productId)); // Use _id here
    } catch (err) {
      console.error('Error removing item from wishlist:', err);
      setError('Failed to remove item. Please try again.');
    }
  };

  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not logged in');
      }

      // Decode the token to get the user ID
      const decoded = jwtDecode(token);
      const userId = decoded.user.id;

      // Send the product ID and user ID to the backend
      await axios.post('http://localhost:5000/api/cart/add', {
        user: userId,
        productId: productId,
        quantity: 1, // Default quantity to 1
      });

      console.log("Product added to cart!");
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading your wishlist...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-600">Your wishlist is empty!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item._id} // Use _id here as key
              className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-32 h-32 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
              <p className="text-gray-600 mb-4">${item.price}</p>
              <button
                onClick={() => removeFromWishlist(item._id)} // Pass _id as productId
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Remove
              </button>
              <button
                onClick={() => addToCart(item._id)} // Add to cart
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition mt-2"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;