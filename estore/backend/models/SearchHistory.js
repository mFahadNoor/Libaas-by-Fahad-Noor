// models/SearchHistory.js
const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to the Product model
    required: true,
  },
  searchTerm: {
    type: String,
    required: true,
  },
  searchDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
