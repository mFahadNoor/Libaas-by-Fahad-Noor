const Review = require('../models/reviewModel.js'); // Import the Reviews model
const mongoose = require('mongoose');

// Controller for CRUD operations
const reviewsController = {
  // Create a new review
  createReview: async (req, res) => {
    try {
      const { userId, productId, rating, review } = req.body;
      if (!userId || !productId || !rating || !review) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      const newReview = await Review.create({ userId, productId, rating, review });
      res.status(201).json({ message: 'Review created successfully.', review: newReview });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating review.', error: error.message });
    }
  },

  getReviewsByUser: async (req, res) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
      }

      // Use Mongoose's `.find()` method to retrieve reviews by userId
      const reviews = await Review.find({ userId });
      if (reviews.length === 0) {
        return res.status(404).json({ message: 'No reviews found for this user.' });
      }

      res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching reviews for user.', error: error.message });
    }
  },

  // Get all reviews
  getAllReviews: async (req, res) => {
    try {
      const reviews = await Review.findAll(); // Use `.find()` for MongoDB
      res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching reviews.', error: error.message });
    }
  },

  // Get reviews by product ID
  getReviewsByProduct: async (req, res) => {
    try {
      const { productId } = req.params;
      // Use Mongoose's .find() method for querying the reviews based on the productId
      const reviews = await Review.find({ productId }); 
      res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching reviews for product.', error: error.message });
    }
  },
  

  // Update a review
  updateReview: async (req, res) => {
    try {
      const { id } = req.params;
      const { rating, review } = req.body;

      const existingReview = await Review.findById(id);
      if (!existingReview) {
        return res.status(404).json({ message: 'Review not found.' });
      }

      existingReview.rating = rating || existingReview.rating;
      existingReview.review = review || existingReview.review;
      await existingReview.save();

      res.status(200).json({ message: 'Review updated successfully.', review: existingReview });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating review.', error: error.message });
    }
  },

  // Delete a review
  deleteReview: async (req, res) => {
    try {
      const { id } = req.params;
  
      // Validate the ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid review ID.' });
      }
  
      // Use Mongoose's findByIdAndDelete to directly delete the review
      const review = await Review.findByIdAndDelete(id);
      if (!review) {
        return res.status(404).json({ message: 'Review not found.' });
      }
  
      res.status(200).json({ message: 'Review deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting review.', error: error.message });
    }
  }
  
};


module.exports = reviewsController;
