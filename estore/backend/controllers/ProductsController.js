// controllers/ProductsController.js
const Product = require('../models/Products.js'); // Assuming Product is your Mongoose model

// Get all products, with optional filtering by category
// Get all products, with optional filtering by category and gender
exports.getProducts = async (req, res) => {
  try {
    const { category, gender } = req.query; // Get category and gender from the query string

    // Build the query object dynamically
    const query = {};
    if (category && category !== 'all') {
      query.category = category; // Add category filter if provided
    }
    if (gender && gender !== 'all') {
      query.gender = gender; // Add gender filter if provided
    }

    const products = await Product.find(query); // Query products based on the built query object
    res.status(200).json(products); // Send the products as a JSON response
  } catch (err) {
    res.status(500).json({ error: 'Error fetching products', details: err });
  }
};


// Add a new product (if required)
exports.addProducts = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct); // Return the newly added product
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error });
  }
};
