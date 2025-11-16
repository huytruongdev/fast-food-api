const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  id: String,
  imageCard: String,
  imageDetail: String,
  name: String,
  price: Number,
  rate: Number,
  specialItems: String,
  categoryId: { type: String, required: true }, // liên kết với Category
  kcal: Number,
  time: String,
});

module.exports = mongoose.model("Products", ProductSchema);
