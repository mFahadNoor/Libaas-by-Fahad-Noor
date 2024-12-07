const express = require('express');
const reviewsController = require('../controllers/reviewsController.js');

const router = express.Router();

// Route to create a new review
router.post('/add', reviewsController.createReview);

// Route to get all reviews
router.get('/get', reviewsController.getAllReviews);

// Route to get reviews by product ID
router.get('/:productId', reviewsController.getReviewsByProduct);

// Route to update a review
router.put('/:id', reviewsController.updateReview);

// Route to delete a review
router.delete('/:id', reviewsController.deleteReview);

module.exports = router;
