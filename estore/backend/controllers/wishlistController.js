const Wishlist = require("../models/Wishlist.js");
const Product = require("../models/Products.js");


const addToWishlist = async (req, res) => {
    console.log('Request received:', req.body);  // Log incoming request data
  
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
  

module.exports = { addToWishlist };
