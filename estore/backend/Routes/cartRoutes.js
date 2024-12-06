// cartRoutes.js

const express = require('express');
const router = express.Router();
const { addToCart, removeFromCart, viewCart } = require('../controllers/cartController');

// POST route to add product to cart
router.post('/add', addToCart);

// POST route to remove product from cart
router.post('/remove', removeFromCart);

// GET route to view cart
router.get('/view', viewCart);

module.exports = router;
