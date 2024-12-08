const express = require('express');
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
} = require('../controllers/productController');
const { getProductPerformance } = require('../controllers/salesAnalyticsController');
const upload = require("../utils/multer");

const router = express.Router();

// Specific routes first
router.get('/products/performance', getProductPerformance);

// Then parameter routes
router.post('/products', upload.single("image"), createProduct);
router.put('/products/:id', upload.single("image"), updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/products', getProducts);
router.get('/products/:id', getProductById);

module.exports = router;
