const Wishlist = require("../models/wishlistModel.js");
const Product = require("../models/productModel.js");

/**
 * Add a product to the wishlist.
 */
const addToWishlist = async (req, res) => {
  console.log('Request received:', req.body); // Log incoming request data
  const { user, productId } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ user });
    if (!wishlist) {
      wishlist = new Wishlist({ user, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
      console.log('Product added to wishlist');
      return res.status(200).json({ success: true, message: 'Product added to wishlist' });
    } else {
      console.log('Product already in wishlist');
      return res.status(400).json({ success: false, message: 'Product already in wishlist' });
    }
  } catch (error) {
    console.error('Error adding to wishlist', error);
    return res.status(500).json({ success: false, message: 'Error adding to wishlist' });
  }
};

/**
 * Fetch the wishlist for a specific user.
 */
const getWishlist = async (req, res) => {
  const { userId } = req.params;

  try {
    const wishlist = await Wishlist.findOne({ user: userId }).populate('products');
    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    return res.status(200).json({ success: true, wishlist: wishlist.products });
  } catch (error) {
    console.error('Error fetching wishlist', error);
    return res.status(500).json({ success: false, message: 'Error fetching wishlist' });
  }
};

/**
 * Remove a product from the wishlist.
 */
const removeFromWishlist = async (req, res) => {
  const { user, productId } = req.body;

  try {
    const wishlist = await Wishlist.findOne({ user });
    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    const productIndex = wishlist.products.indexOf(productId);
    if (productIndex === -1) {
      return res.status(400).json({ success: false, message: 'Product not in wishlist' });
    }

    wishlist.products.splice(productIndex, 1);
    await wishlist.save();
    return res.status(200).json({ success: true, message: 'Product removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist', error);
    return res.status(500).json({ success: false, message: 'Error removing from wishlist' });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};
