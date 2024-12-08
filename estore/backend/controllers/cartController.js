// cartController.js

const Cart = require('../models/cartModel.js');  // Assuming you have a Cart model

// Add product to cart
const addToCart = async (req, res) => {
  const { user, productId, quantity } = req.body;

  // Ensure that the quantity is a valid number
  const validQuantity = Number(quantity);
  if (isNaN(validQuantity) || validQuantity <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid quantity' });
  }

  try {
    // Find the user's cart
    let cart = await Cart.findOne({ user });

    // If the cart doesn't exist, create a new one
    if (!cart) {
      // Creating a new cart with the product added
      cart = new Cart({
        user,
        items: [{ product: productId, quantity: validQuantity }],
      });
      await cart.save();  // Save the new cart
      return res.status(200).json({ success: true, message: 'Cart created and product added' });
    } else {
      // Ensure items array exists in the cart
      if (!cart.items) {
        cart.items = [];
      }

      // Check if the product is already in the cart
      const productIndex = cart.items.findIndex(item => item.product.toString() === productId);

      if (productIndex === -1) {
        // If the product isn't already in the cart, add it
        cart.items.push({ product: productId, quantity: validQuantity });
      } else {
        // If the product is already in the cart, update its quantity
        cart.items[productIndex].quantity += validQuantity;
      }

      // Save the updated cart
      await cart.save();

      return res.status(200).json({ success: true, message: 'Product added to cart' });
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({ success: false, message: 'Error adding to cart' });
  }
};

// Remove product from cart
const removeFromCart = async (req, res) => {
  const { user, productId } = req.body;

  try {
    // Ensure the user and productId are provided
    if (!user || !productId) {
      return res.status(400).json({ success: false, message: "User and productId are required" });
    }

    // Find the cart associated with the user
    const cart = await Cart.findOne({ user });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found for this user" });
    }

    // Find the product in the cart and remove it
    const productIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    // Remove the item from the cart
    cart.items.splice(productIndex, 1);

    // Save the updated cart
    await cart.save();

    res.json({ success: true, message: "Item removed from cart" });
  } catch (err) {
    console.error("Error removing item from cart:", err);
    res.status(500).json({ success: false, message: "Error removing from cart" });
  }
};

// View cart
const viewCart = async (req, res) => {
  const { user } = req.query;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ user });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error('Error viewing cart:', error);
    return res.status(500).json({ success: false, message: 'Error viewing cart' });
  }
};

// Clear all items from the cart
const clearCart = async (req, res) => {
  const { user } = req.body;  // Assuming the user ID is passed in the body

  try {
    // Ensure that the user is provided
    if (!user) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ user });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found for this user' });
    }

    // Clear the cart items by setting them to an empty array
    cart.items = [];

    // Save the updated cart
    await cart.save();

    res.json({ success: true, message: 'Cart cleared successfully' });
  } catch (err) {
    console.error('Error clearing the cart:', err);
    res.status(500).json({ success: false, message: 'Error clearing the cart' });
  }
};

// Update product quantity in cart
const updateCart = async (req, res) => {
  const { user, productId, quantity } = req.body;

  // Ensure that the quantity is a valid number
  const validQuantity = Number(quantity);
  if (isNaN(validQuantity) || validQuantity <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid quantity' });
  }

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ user });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found for this user" });
    }

    // Find the product in the cart
    const productIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    // Update the product's quantity
    cart.items[productIndex].quantity = validQuantity;

    // Save the updated cart
    await cart.save();

    res.status(200).json({ success: true, message: "Cart updated successfully" });
  } catch (err) {
    console.error("Error updating cart:", err);
    res.status(500).json({ success: false, message: "Error updating cart" });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  viewCart,
  clearCart,
  updateCart,  // Export the updateCart function
};
