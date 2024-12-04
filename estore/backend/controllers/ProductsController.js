// controllers/ProductsController.js
const Product = require('../models/Products.js'); // Assuming Product is your Mongoose model
exports.getProducts = async (req, res) => {
  try {
    const { category, gender, brand, name } = req.query; // Get category and gender from the query string

    // Build the query object dynamically
    const query = {};
    if (category && category !== 'all') {
      query.category = category; // Add category filter if provided
    }
    if (gender && gender !== 'all') {
      query.gender = gender; // Add gender filter if provided
    }
    if (brand && brand !== 'all') {
      query.brand = brand; // Add brand filter if provided
    }
    if (name) {
      query.name = { $regex: name, $options: 'i' }; // Case-insensitive regex search for product name
    }

    const products = await Product.find(query); // Query products based on the built query object
    res.status(200).json(products); // Send the products as a JSON response
  } catch (err) {
    res.status(500).json({ error: 'Error fetching products', details: err });
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params; // Extract the product ID from the route parameters

    // Fetch the product by ID from the database
    const product = await Product.findById(id);

    // If the product does not exist, return a 404 error
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Return the product as a JSON response
    res.status(200).json(product);
  } catch (err) {
    // Handle errors (e.g., invalid ID format)
    res.status(500).json({ error: 'Error fetching product by ID', details: err });
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
