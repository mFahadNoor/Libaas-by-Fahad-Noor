const Product = require('../models/Product');

// Create a new product
const createProduct = async (req, res) => {
  const { name, price, category, stock, description, tags } = req.body;

  try {
    const sellerID = '64eabb7e0d1e490001a0c123'; // Mock seller ID
    const brand = 'Nike'; // Mock brand
    const image = req.file ? req.file.filename : null; // Handle uploaded image

    const product = new Product({
      name,
      price,
      category,
      stock,
      description,
      tags: JSON.parse(tags), // Parse JSON tags
      sellerID,
      brand,
      images: image ? [image] : [], // Add uploaded image
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

  

// Update a product
const updateProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all products for a seller
const getProducts = async (req, res) => {
  try {
     // Debugging log
    const sellerID = '64eabb7e0d1e490001a0c123';
    const products = await Product.find({ sellerID });
     // Debugging log
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).json({ message: err.message });
  }
};


module.exports = { createProduct, updateProduct, deleteProduct, getProducts };

// Fetch a single product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

  
  module.exports = { createProduct, updateProduct, deleteProduct, getProducts, getProductById };
  