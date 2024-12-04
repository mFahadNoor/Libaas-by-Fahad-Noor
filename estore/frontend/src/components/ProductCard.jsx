import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductCard = ({ product, onAddToWishlist, onAddToCart }) => {
  const handleAddToWishlist = async () => {
    // Dummy user ID for testing (replace with actual user ID in production)
    const userId = '6750a1d30ec156af32047712'; 
  
    try {
      const response = await axios.post('/api/wishlist/add', {
        user: userId,
        productId: product.id,
      });
  
      if (response.data.success) {
      } else {
      }
    } catch (error) {
    }
  
    // Call the function passed down from the parent (if needed)
    if (onAddToWishlist) {
      onAddToWishlist(product.id); // Call this only if needed and not for alert purpose
    }
  };
  

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product.id); // Call the function passed down from the parent to add to cart
    }
  };

  return (
    <div className="group relative">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        {/* Wrap the image with Link component */}
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
      </div>

      {/* Add to Cart and View Details Buttons */}
      <div className="mt-4 flex flex-col">
        <button
          onClick={handleAddToCart}
          className="bg-black text-white py-2 px-4 rounded-md mb-2 h-10 hover:bg-gray-800 transition"
        >
          Add to Cart
        </button>
        <Link
          to={`/products/${product.id}`} // Assuming the product details page is under "/product/:id"
          className="text-center bg-gray-300 text-black py-2 px-4 rounded-md h-10 hover:bg-gray-400 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
