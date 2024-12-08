const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  brand: { type: String, required: true }, // Automatically filled from seller
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  sellerID: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true }, // Will reference the seller
  description: { type: String },
  tags: { type: [String] }, // Array of tags for product filtering
  images: { type: [String] }, // Array of image URLs
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
