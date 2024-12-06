// Cart.js
import React, { useState, useEffect } from "react";

const Cart = () => {
  // Example cart data (You can replace this with data fetched from the backend)
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Product 1", price: 20, quantity: 2 },
    { id: 2, name: "Product 2", price: 30, quantity: 1 },
  ]);

  // Calculate the total cost
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Handle the increase in quantity
  const increaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Handle the decrease in quantity
  const decreaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Handle removing an item from the cart
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Handle checkout action (simulated for now)
  const handleCheckout = () => {
    alert("Proceeding to checkout...");
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-xl text-gray-500">Your cart is empty</p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md">
              <div className="flex flex-col">
                <span className="text-xl font-bold">{item.name}</span>
                <span className="text-lg text-gray-600">${item.price}</span>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  className="bg-gray-200 text-xl p-2 rounded-full"
                  onClick={() => decreaseQuantity(item.id)}
                >
                  -
                </button>
                <span className="text-lg font-medium">{item.quantity}</span>
                <button
                  className="bg-gray-200 text-xl p-2 rounded-full"
                  onClick={() => increaseQuantity(item.id)}
                >
                  +
                </button>
              </div>

              <div className="text-lg font-semibold">${item.price * item.quantity}</div>

              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={() => removeItem(item.id)}
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
        onClick={handleCheckout}
      >
        Checkout
      </button>
    </div>
  );
};

export default Cart;
