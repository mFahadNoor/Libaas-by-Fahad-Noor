// routes/searchHistoryRoutes.js
const express = require('express');
const {
  saveSearchAndReturnProducts,
  getUserSearchHistory,
  getProductsBySearchTerm,
} = require('../controllers/SearchHistoryController.js');

const router = express.Router();

// Route to save search and get matching products
router.post('/search', saveSearchAndReturnProducts);

// Route to get user's search history
router.get('/history/:userId', getUserSearchHistory);

router.get('/term/:searchTerm', getProductsBySearchTerm);

module.exports = router;
  