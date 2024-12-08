const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  bulkAdd,
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(getProducts)
  .post(protect, authorize("SELLER", "ADMIN"), createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, authorize("SELLER", "ADMIN"), updateProduct)
  .delete(protect, authorize("SELLER", "ADMIN"), deleteProduct);
router
  .route("/bulk-upload")
  .post(protect, authorize("SELLER", "ADMIN"), bulkAdd);

module.exports = router;
