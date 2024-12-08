import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductCard = ({ product, onAddToWishlist, onAddToCart }) => {
  const handleAddToWishlist = async () => {
    let userId = '6751b855ec4025be11ec0d48'; // Dummy user ID for testing

    // Get the user object from localStorage
    const user = JSON.parse(localStorage.getItem('user')); // Assuming user object is stored here

    if (user && user.id) {
      userId = user.id; // Get the userId from the user object in localStorage
      console.log(`User ID from localStorage: ${userId}`);
    } else {
      console.error('User not logged in or user ID not found in localStorage');
      return; // Exit if no user ID found
    }

    try {
      const response = await axios.post('/api/wishlist/add', {
        user: userId, // Send the userId directly from localStorage
        productId: product.id,
      });

      if (response.data.success) {
        console.log('Product added to wishlist!');
      } else {
        console.error('Failed to add product to wishlist:', response.data.message);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }

    if (onAddToWishlist) {
      onAddToWishlist(product.id); // Call parent handler if provided
    }
  };

  const handleAddToCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user')); // Get user from localStorage

      if (!user || !user.id) {
        throw new Error('User not logged in');
      }

      const userId = user.id; // Extract the user ID from the user object in localStorage

      const response = await axios.post('http://localhost:5000/api/cart/add', {
        user: userId,
        productId: product.id,
        quantity: 1, // Default quantity to 1
        
      });
      

      console.log(response.data.message); // Log success message
      alert('Product added to cart!');

      if (onAddToCart) {
        onAddToCart(product.id); // Call parent handler if provided
        
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  return (
    <div className="group relative">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:opacity-75 transition"
          />
        </Link>
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition"
          onClick={handleAddToWishlist}
        >
          <Heart size={20} />
        </button>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
        <p className="mt-1 text-gray-600">${product.price.toFixed(2)}</p>
        <p className="mt-1 text-gray-600">{product.stock+" items left in stock"}</p>
      </div>

      <div className="mt-4 flex flex-col">
        <button
          onClick={handleAddToCart} // Call handleAddToCart on click
          className="bg-black text-white py-2 px-4 rounded-md mb-2 h-10 hover:bg-gray-800 transition"
        >
          Add to Cart
        </button>
        <Link
          to={`/products/${product.id}`}
          className="text-center bg-gray-300 text-black py-2 px-4 rounded-md h-10 hover:bg-gray-400 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
