const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  id: String,
  imageCard: String,
  imageDetail: String,
  name: String,

  price: {
    type: Number,
    required: true,
  },
  originPrice: {
    type: Number,
    required: true,
  },

  rate: Number,
  specialItems: String,
  categoryId: { type: String, required: true },
  kcal: Number,
  time: String,

  salePercentage: {
    type: Number,
    default: 0,
  },
  saleEndTime: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("Products", ProductSchema);
