// controllers/searchHistoryController.js
const SearchHistory = require('../models/SearchHistory');
const Product = require('../models/Products.js');

// Save Search and Return Matching Products

exports.getProductsBySearchTerm = async (req, res) => {
    const { searchTerm } = req.params;
  
    try {
      // Find products that match the search term
      const matchingProducts = await Product.find({
        name: { $regex: searchTerm, $options: 'i' }, // Case-insensitive match
      });
  
      if (matchingProducts.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No products found for the search term.',
        });
      }
  
      res.status(200).json({
        success: true,
        products: matchingProducts,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products for the search term.',
      });
    }
  };

exports.saveSearchAndReturnProducts = async (req, res) => {
  const { userId, searchTerm } = req.body;

  try {
    // Find matching products
    const matchingProducts = await Product.find({
      name: { $regex: searchTerm, $options: 'i' }, // Case-insensitive search
    });

    // Save each matching product in search history
    const searchHistoryEntries = matchingProducts.map((product) => ({
      userId,
      productId: product._id,
      searchTerm,
    }));

    await SearchHistory.insertMany(searchHistoryEntries);

    res.status(200).json({
      success: true,
      products: matchingProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to process search',
    });
  }
};

// Get Search History for a User
exports.getUserSearchHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const history = await SearchHistory.find({ userId })
      .populate('productId', 'name price') // Populate product details
      .sort({ searchDate: -1 }); // Sort by most recent

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch search history',
    });
  }
};
