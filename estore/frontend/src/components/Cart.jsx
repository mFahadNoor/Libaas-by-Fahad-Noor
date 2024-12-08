import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash, PlusIcon, MinusIcon } from 'lucide-react';
import LoadingScreen from "../components/LoadingPage/LoadingPage.jsx";
import Navbarwithoutsb from "./Navbarwithoutsb.jsx";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          throw new Error("User not logged in");
        }
        
        setUserId(user.id);
        
        const response = await axios.get(`http://localhost:5000/api/cart/view?user=${user.id}`);
        const items = response.data.cart.items || [];
        
        const productDetailsPromises = items.map(async (item) => {
          const productResponse = await axios.get(`http://localhost:5000/api/products/${item.product}`);
          return { ...item, product: productResponse.data };
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
  }, []);
  
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.product.price);
      const quantity = Number(item.quantity);
      return total + price * quantity;
    }, 0);
  };
  
  const increaseQuantity = async (id) => {
    const itemToUpdate = cartItems.find((item) => item._id === id);
    
    if (itemToUpdate) {
      itemToUpdate.quantity += 1;
      
      try {
        await axios.post('http://localhost:5000/api/cart/update', {
          user: userId,
          productId: itemToUpdate.product._id,
          quantity: itemToUpdate.quantity
        });
        
        setCartItems([...cartItems]);
      } catch (err) {
        console.error("Error increasing quantity:", err);
        setError("Failed to update quantity. Please try again.");
      }
    }
  };
  
  const decreaseQuantity = async (id) => {
    const itemToUpdate = cartItems.find((item) => item._id === id);
    
    if (itemToUpdate && itemToUpdate.quantity > 1) {
      itemToUpdate.quantity -= 1;
      
      try {
        await axios.post('http://localhost:5000/api/cart/update', {
          user: userId,
          productId: itemToUpdate.product._id,
          quantity: itemToUpdate.quantity
        });
        
        setCartItems([...cartItems]);
      } catch (err) {
        console.error("Error decreasing quantity:", err);
        setError("Failed to update quantity. Please try again.");
      }
    }
  };
  
  const removeItem = async (productId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/cart/remove', {
        user: userId,
        productId: productId,
      });
      
      if (response.data.success) {
        setCartItems(cartItems.filter((item) => item.product._id !== productId));
      }
    } catch (err) {
      console.error("Error removing item from cart:", err);
      setError("Failed to remove item. Please try again.");
    }
  };
  
  const clearCart = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/cart/clear', {
        user: userId,
      });
      
      if (response.data.success) {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError("Failed to clear cart. Please try again.");
    }
  };
  
  const handleCheckout = async () => {
    try {
      const outOfStockItems = cartItems.filter(item => item.quantity > item.product.stock);
      
      if (outOfStockItems.length > 0) {
        const outOfStockMessage = outOfStockItems.map(item => 
        `${item.product.name}: Requested ${item.quantity}, Available ${item.product.stock}`
        ).join('\n');
        
        alert(`The following items are out of stock:\n${outOfStockMessage}`);
        return;
      }
      
      const userData = JSON.parse(localStorage.getItem("user"));
      
      const response = await axios.post('http://localhost:5000/api/order', {
        user: userData.id,
        orderItems: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        }))
      }, {
        headers: {
          'Authorization': `Bearer ${userId}`
        }
      });
      
      if (response.data._id) {
        for (const item of cartItems) {
          const updatedQuantity = item.product.stock - item.quantity;
          
          await axios.put(`http://localhost:5000/api/products/update-quantity/${item.product._id}`, {
            stock: updatedQuantity
          }); 
        }
        
        await clearCart();
        alert(`Order placed successfully! Order ID: ${response.data._id}`);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to place order. " + (err.response?.data?.message || "Please try again."));
    }
  };
  
  if (loading) return <LoadingScreen />;
  
  return (
    <div className="parent min-h-screen overflow-hidden shadow-lg">
      <Navbarwithoutsb />
      
      <div className="p-4 md:p-10 parent min-h-full grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        <div className="overflow-y-auto child lg:col-span-2 bg-white rounded-lg p-4 md:p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold">Shopping Bag</h2>
            <p className="text-sm md:text-base text-gray-500">{cartItems.length} item(s) in your bag</p>
          </div>
          
          {cartItems.length === 0 ? (
            <p className="text-center text-base md:text-lg text-gray-500">
              Your cart is empty. <Trash className="inline-block text-gray-400" />
            </p>
          ) : (
            <div className="space-y-4 md:space-y-6">
              {cartItems.map((item) => (
                <div 
                  key={item._id} 
                  className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4 justify-between items-center border-b pb-2 md:pb-4"
                >
                  <div className="col-span-3 flex items-center space-x-2 md:space-x-4">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-16 h-16 md:w-24 md:h-24 rounded-lg object-cover shadow-sm" 
                    />
                    <div>
                      <h3 className="font-semibold text-sm md:text-lg">{item.product.name}</h3>
                      <p className="text-xs md:text-sm text-gray-500">Color: Blue | Size: 42</p>
                      <p className="text-base md:text-lg font-bold text-gray-900">${item.product.price.toFixed(2)}</p>
                      <p
                        className={`text-xs md:text-sm ${
                          item.product.stock === 0
                          ? "text-red-500"
                          : item.product.stock < 5
                          ? "text-yellow-500"
                          : "text-gray-500"
                        }`}
                      >
                        Items left in Stock: {item.product.stock}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center justify-center space-x-2 md:space-x-3">
                    <button 
                      onClick={() => decreaseQuantity(item._id)} 
                      className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      <MinusIcon className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                    <span className="text-sm md:text-lg">{item.quantity}</span>
                    <button 
                      onClick={() => increaseQuantity(item._id)} 
                      className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      <PlusIcon className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm md:text-lg font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <button 
                      className="text-red-600 hover:text-red-800" 
                      onClick={() => removeItem(item.product._id)}
                    >
                      <Trash className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="child bg-white rounded-lg p-4 md:p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg md:text-xl font-bold">Calculated Shipping</h3>
            <button onClick={clearCart} className="flex items-center text-sm">
              <p className="mr-1">clear cart</p>
              <Trash className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-sm md:text-base text-gray-700">Country</label>
              <select className="w-full bg-gray-200 p-1 md:p-2 rounded text-xs md:text-base">
                <option>United States</option>
              </select>
            </div>
            <div>
              <label className="block text-sm md:text-base text-gray-700">State / City</label>
              <input 
                className="w-full bg-gray-200 p-1 md:p-2 rounded text-xs md:text-base" 
                placeholder="Enter state" 
              />
            </div>
            <div>
              <label className="block text-sm md:text-base text-gray-700">ZIP Code</label>
              <input 
                className="w-full bg-gray-200 p-1 md:p-2 rounded text-xs md:text-base" 
                placeholder="Enter ZIP code" 
              />
            </div>
          </div>
          
          <button className="w-full mt-3 md:mt-6 bg-black hover:bg-gray-600 text-white py-1 md:py-2 rounded text-sm md:text-base">
            Update
          </button>
          
          <div className="mt-3 md:mt-6 bg-yellow-100 p-2 md:p-4 rounded">
            <p className="flex justify-between text-sm md:text-base">
              <span>Subtotal</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </p>
            <p className="flex justify-between text-sm md:text-base">
              <span>Shipping</span>
              <span>$0.00</span>
            </p>
            <p className="flex justify-between font-bold text-base md:text-lg">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </p>
          </div>
          
          <button 
            className="w-full mt-2 md:mt-3 bg-black text-white py-2 md:py-3 rounded shadow hover:bg-gray-600 text-sm md:text-base" 
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;