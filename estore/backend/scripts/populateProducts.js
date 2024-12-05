// scripts/populateProducts.js
const mongoose = require('mongoose');
const Product = require('../models/Product');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const products = [
  { name: 'Classic White Tee', price: 29.99, image: 'url_here', category: 'essentials' },
  { name: 'Denim Jacket', price: 89.99, image: 'url_here', category: 'outerwear' },
  // Add more products
];

Product.insertMany(products)
  .then(() => {
    console.log('Products added');
    mongoose.connection.close();
  })
  .catch(err => console.error('Error adding products:', err));
