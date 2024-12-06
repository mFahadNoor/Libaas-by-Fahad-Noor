import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Corrected import for jwt-decode

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors
  const [userId, setUserId] = useState(null); // To store user ID

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User not logged in");
        }

        // Decode the token to get the user ID
        const decoded = jwtDecode(token);
        setUserId(decoded.user.id);

        // Fetch cart data for the user
        const response = await axios.get(`http://localhost:5000/api/cart/view?user=${decoded.user.id}`);
        const items = response.data.cart.items || [];

        // Fetch product details for each item in the cart
        const productDetailsPromises = items.map(async (item) => {
          const productResponse = await axios.get(`http://localhost:5000/api/products/${item.product}`);
          return { ...item, product: productResponse.data }; // Merge product details with cart item
        });

        const cartItemsWithDetails = await Promise.all(productDetailsPromises);
        setCartItems(cartItemsWithDetails);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Failed to load cart. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []); // This effect runs only once when the component is mounted

  // Calculate the total cost
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.product.price); // Ensure price is a number
      const quantity = Number(item.quantity); // Ensure quantity is a number
      return total + price * quantity;
    }, 0);
  };

  // Handle the increase in quantity
  const increaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Handle the decrease in quantity
  const decreaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item._id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Handle removing an item from the cart
  const removeItem = async (productId) => {
    try {
      // Sending a POST request to remove the item from the cart
      const response = await axios.post('http://localhost:5000/api/cart/remove', {
        user: userId,        // Using the userId decoded from the token
        productId: productId,
      });

      // Update the state after successfully removing the item
      if (response.data.success) {
        setCartItems(cartItems.filter((item) => item.product._id !== productId));
      }
    } catch (err) {
      console.error("Error removing item from cart:", err);
      setError("Failed to remove item. Please try again.");
    }
  };

  // Handle clearing the cart (clear all items)
  const clearCart = async () => {
    try {
      // Sending a POST request to clear the cart
      const response = await axios.post('http://localhost:5000/api/cart/clear', {
        user: userId,        // Using the userId decoded from the token
      });

      // Update the state after successfully clearing the cart
      if (response.data.success) {
        setCartItems([]); // Clear the cart items from state
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError("Failed to clear cart. Please try again.");
    }
  };

  // Handle checkout action
  const handleCheckout = () => {
    const cartDetails = cartItems.map(item => 
      `${item.product.name} (Quantity: ${item.quantity}, Price: $${item.product.price})`
    ).join('\n');

    alert(`Your Cart:\n${cartDetails}\n\nTotal Cost: $${calculateTotal()}`);
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading your cart...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-xl text-gray-500">Your cart is empty</p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <img src={item.product.image} alt={item.product.name} className="h-16 w-16 object-cover rounded-md mr-4" />
                <div className="flex flex-col">
                  <span className="text-xl font-bold">{item.product.name}</span>
                  <span className="text-lg text-gray-600">${item.product.price}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  className="bg-gray-200 text-xl p-2 rounded-full"
                  onClick={() => decreaseQuantity(item._id)}
                >
                  -
                </button>
                <span className="text-lg font-medium">{item.quantity}</span>
                <button
                  className="bg-gray-200 text-xl p-2 rounded-full"
                  onClick={() => increaseQuantity(item._id)}
                >
                  +
                </button>
              </div>

              <div className="text-lg font-semibold">${item.product.price * item.quantity}</div>

              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={() => removeItem(item.product._id)} // Pass the product ID to the remove function
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-lg">
        <div className="text-2xl font-semibold">Total Cost</div>
        <div className="text-xl font-medium">${calculateTotal()}</div>
      </div>

      <button
        className="mt-6 w-full bg-green-500 text-white text-lg font-semibold py-3 rounded-lg shadow-md hover:bg-green-600"
        onClick={clearCart} // Trigger the clear cart function
      >
        Clear Cart
      </button>
      
      <button
        className="mt-6 w-full bg-blue-500 text-white text-lg font-semibold py-3 rounded-lg shadow-md hover:bg-blue-600"
        onClick={handleCheckout} // Handle checkout action
      >
        Checkout
      </button>
    </div>
  );
};

export default Cart;
