import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash, PlusIcon, MinusIcon } from 'lucide-react'; // Import Trash icon
import LoadingScreen from "../components/LoadingPage/LoadingPage.jsx"; // Import the loading screen
import Navbarwithoutsb from "./Navbarwithoutsb.jsx";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors
  const [userId, setUserId] = useState(null); // To store user ID
  
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user")); // Get user from localStorage
        if (!user) {
          throw new Error("User not logged in");
        }
        
        setUserId(user.id); // Extract user ID directly from localStorage
        
        // Fetch cart data for the user
        const response = await axios.get(`http://localhost:5000/api/cart/view?user=${user.id}`);
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
  
  // Handle the decrease in quantity
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
  
  // Handle removing an item from the cart
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
  
  // Handle clearing the cart
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
  
  // Handle checkout action
  const handleCheckout = async () => {
    try {
      // First, check stock availability for all items
      const outOfStockItems = cartItems.filter(item => item.quantity > item.product.stock);
      
      if (outOfStockItems.length > 0) {
        // Create a message listing out-of-stock items
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
        // Update product quantities after successful order
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
  
  // if (error) {
  //   return <p className="text-center text-red-600">{error}</p>;
  // }
  
  return (
  <div className="parent h-screen overflow-hidden shadow-lg">
    <Navbarwithoutsb />
    
    <div className="p-10 parent h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="overflow-y-scroll child col-span-2 bg-white rounded-lg p-6 shadow-md" style={{height:'90%'}}>
        <h2 className="text-2xl font-bold mb-4">Shopping Bag</h2>
        <p className="text-gray-500 mb-6">{cartItems.length} item(s) in your bag</p>
        
        {cartItems.length === 0 ? (
          <p className="text-center text-lg text-gray-500">
            Your cart is empty. <Trash className="inline-block text-gray-400" />
          </p>
          ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item._id} className="grid grid-cols-5 justify-between items-center border-b pb-4">
                <div className="col-span-3 flex items-center space-x-4">
                  <img src={item.product.image} alt={item.product.name} className="w-24 h-24 rounded-lg object-cover shadow-sm" />
                  <div>
                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                    <p className="text-gray-500">Color: Blue | Size: 42</p>
                    <p className="text-lg font-bold text-gray-900">${item.product.price.toFixed(2)}</p>
                    <p
                    className={`text-gray-500 ${
                      item.product.stock === 0
                      ? "text-red-500" // If quantity is 0, make the text red
                      : item.product.stock < 5
                      ? "text-yellow-500" // If quantity is less than 5, make the text yellow
                      : ""
                    }`}
                    >
                    Items left in Stock: {item.product.stock}
                  </p>                    </div>
                </div>
                <div className="col-span-1 flex items-center space-x-3">
                  <button onClick={() => decreaseQuantity(item._id)}>
                    <MinusIcon className="inline-block w-4" />
                  </button>
                  <span className="text-lg">{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item._id)}>
                    <PlusIcon className="inline-block w-4" />
                  </button>
                </div>
                <div className="flex justify-between">
                  <p className="col-span-1 text-lg font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                  <button className="text-red-600 hover:text-red-800" onClick={() => removeItem(item.product._id)}>
                    <Trash className="inline-block" />
                  </button>
                </div>
              </div>
              ))}
            </div>
            )}
          </div>
          
          <div className="child bg-white rounded-lg p-6 shadow-md overflow-hidden" style={{height:'90%'}}>
            <div className="flex justify-between">
              <h3 className="text-xl font-bold mb-2">Calculated Shipping</h3>
              <button onClick={clearCart}>
                <div className="items-center flex">
                  <p className="text-center text-sm">clear cart</p>
                  <Trash className="item-center" />
                </div>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Country</label>
                <select className="w-full bg-gray-200 p-2 rounded">
                  <option>United States</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">State / City</label>
                <input className="w-full bg-gray-200 p-2 rounded" placeholder="Enter state" />
              </div>
              <div>
                <label className="block text-gray-700">ZIP Code</label>
                <input className="w-full bg-gray-200 p-2 rounded" placeholder="Enter ZIP code" />
              </div>
            </div>
            <button className="w-full mt-6 bg-black hover:bg-gray-600 text-white py-2 rounded">
              Update
            </button>
            
            <div className="mt-6 bg-yellow-100 p-4 rounded">
              <p className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </p>
              <p className="flex justify-between">
                <span>Shipping</span>
                <span>$0.00</span>
              </p>
              <p className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </p>
            </div>
            
            <button className="w-full mt-3 mb-3  bg-black text-white py-3 rounded shadow hover:bg-gray-600" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </div>
      </div>
      );
    };
    
    export default Cart;
