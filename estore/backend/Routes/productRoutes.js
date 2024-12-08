// routes/productRoutes.js
const express = require('express');
const productsController = require('../controllers/ProductsController.js');

const router = express.Router();

// Route to get products
router.get('/customer', productsController.getProducts);

router.post('/add', productsController.addProducts);

router.get('/:id', productsController.getProductById);

router.put('/update-quantity/:id', productsController.updateProductQuantity);


module.exports = router;
