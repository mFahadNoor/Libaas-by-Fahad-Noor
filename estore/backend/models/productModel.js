const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a product name"],
    },
    brand: {
      type: String,
      // required: [true, "Please add a brand"],
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
    },
    image: {
      type: String,
      required: [true, "Please add an image URL"],
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "UNISEX","male","female","unisex"],
      default: "UNISEX",
    },
    stock: {
       type: Number,
        required: true

     },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
