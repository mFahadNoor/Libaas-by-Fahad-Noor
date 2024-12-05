const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, brand, price, image, category, gender } = req.body;

  const product = await Product.create({
    name,
    brand,
    price,
    image,
    category,
    gender,
  });

  res.status(201).json(product);
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { category, gender, brand } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (gender) filter.gender = gender.toUpperCase();
  if (brand) filter.brand = brand;

  const products = await Product.find(filter);
  res.json(products);
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(product);
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  console.log(product);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedProduct);
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.remove();
  res.json({ message: "Product removed" });
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
