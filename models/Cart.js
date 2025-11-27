const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productData: { type: Object, required: true },
  quantity: { type: Number, default: 1 },
  userId: { type: String, required: true },
});

module.exports = mongoose.model("Cart", CartSchema);
