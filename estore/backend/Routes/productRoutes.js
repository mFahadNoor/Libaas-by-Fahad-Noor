// routes/productRoutes.js
const express = require('express');
const productsController = require('../controllers/ProductsController.js');

const router = express.Router();

// Route to get products
router.get('/', productsController.getProducts);

router.post('/add', productsController.addProducts);

router.get('/:id', productsController.getProductById);


module.exports = router;
