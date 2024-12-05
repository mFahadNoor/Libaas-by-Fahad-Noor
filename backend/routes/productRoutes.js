const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(getProducts)
  .post(protect, authorize("SELLER"), createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, authorize("SELLER", "ADMIN"), updateProduct)
  .delete(protect, authorize("SELLER", "ADMIN"), deleteProduct);

module.exports = router;
