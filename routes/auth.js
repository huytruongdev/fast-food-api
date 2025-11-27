const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = "MY_SECRET_KEY";

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist)
      return res.json({ success: false, message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const lastUser = await User.find().sort({ userID: -1 }).limit(1);

    let newID = "u001";

    if (lastUser.length > 0 && lastUser[0].userID) {
      const num = parseInt(lastUser[0].userID.replace("u", "")) + 1;
      newID = "u" + num.toString().padStart(3, "0");
    }
    const user = await User.create({
      userID: newID,
      email,
      password: hashed,
    });

    console.log("New user saved:", user);

    res.json({ success: true, message: "Signup successful", userID: newID });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.json({ success: false, message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.json({ success: false, message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, userID: user.userID }, JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("User logged in:", {
      mongo_id: user._id,
      userID: user.userID,
      email: user.email,
    });

    return res.json({
      success: true,
      token: token,
      userID: user.userID,
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

router.post("/logout", (req, res) => {
  return res.json({ success: true, message: "Logged out" });
});

module.exports = router;
