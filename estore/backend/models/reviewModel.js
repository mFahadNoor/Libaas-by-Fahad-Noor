const mongoose = require('mongoose');

// Define the schema
const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to the Product model
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5 // Rating range between 1 and 5
  },
  review: {
    type: String,
    required: true,
    maxlength: 500 // Limit review text to 500 characters
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
