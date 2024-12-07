import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash } from 'lucide-react';
import Navbar from './Navbarwithoutsb.jsx';
import LoadingScreen from './LoadingPage/LoadingPage.jsx';

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user')); // Get user from localStorage
        if (!user || !user.id) throw new Error('User not logged in');

        const userId = user.id; // Extract the user ID from the user object in localStorage

        const response = await axios.get(`http://localhost:5000/api/wishlist/${userId}`);
        setWishlist(response.data.wishlist || []);
      } catch (err) {
        setError('Failed to load wishlist. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user')); // Get user from localStorage
      if (!user || !user.id) throw new Error('User not logged in');

      const userId = user.id; // Extract the user ID from the user object in localStorage

      await axios.post('http://localhost:5000/api/wishlist/remove', {
        user: userId,
        productId,
      });

      setWishlist(wishlist.filter((item) => item._id !== productId));
    } catch (err) {
      setError('Failed to remove item. Please try again.');
    }
  };

  const addToCart = async (productId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user')); // Get user from localStorage
      if (!user || !user.id) throw new Error('User not logged in');

      const userId = user.id; // Extract the user ID from the user object in localStorage

      await axios.post('http://localhost:5000/api/cart/add', {
        user: userId,
        productId,
        quantity: 1,
      });

      alert('Product added to cart!');
    } catch (err) {
      setError('Failed to add item to cart. Please try again.');
    }
  };

  if (loading) {
    return <LoadingScreen />; // Show loading screen while fetching data
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      {/* Wishlist Section */}
      <div className="py-8 px-4">
        {wishlist.length === 0 ? (
          <p className="text-center text-gray-600">Your wishlist is empty!</p>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-center text-gray-800">Wishlist</h1>
            <div className="grid grid-cols-4 mx-20">
              {wishlist.map((item) => (
                <div key={item._id} className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col m-4">
                  <div className="h-96 relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <button onClick={() => removeFromWishlist(item._id)}>
                      <Trash className="absolute top-2 right-2 inline-block" />
                    </button>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                    <p className="text-gray-600 mb-4">${item.price}</p>
                    <button
                      onClick={() => addToCart(item._id)}
                      className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-600 transition mt-auto"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
