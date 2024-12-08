const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  sellerID: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true }, // Seller associated with the order
  productIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }], // Products in the order
  status: { type: String, enum: ['Pending', 'Packed', 'Shipped', 'Delivered'], default: 'Pending' }, // Order status
  quantity: { type: Number, required: true }, // Total quantity of items in the order
  totalAmount: { type: Number, required: true }, // Total amount of the order
  customerDetails: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
