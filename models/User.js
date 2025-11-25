const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userID: { type: String, unique: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
});

module.exports = mongoose.model("User", UserSchema);


