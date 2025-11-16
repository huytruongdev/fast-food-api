const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();
const JWT_SECRET = "MY_SECRET_KEY";

// ✅ SIGNUP
// router.post("/signup", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const exist = await User.findOne({ email });
//     if (exist)
//       return res.json({ success: false, message: "Email already exists" });

//     const hashed = await bcrypt.hash(password, 10);

//     await User.create({ email, password: hashed });

//     res.json({ success: true, message: "Signup successful" });
//   } catch (err) {
//     res.json({ success: false, message: err.message });
//   }
// });
// ✅ SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist)
      return res.json({ success: false, message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashed });

    // Log ra console để kiểm tra
    console.log("New user saved:", user);

    res.json({ success: true, message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.json({ success: false, message: err.message });
  }
});


// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.json({ success: false, message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ success: true, token });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// ✅ LOGOUT (client chỉ cần xoá token)
router.post("/logout", (req, res) => {
  return res.json({ success: true, message: "Logged out" });
});


module.exports = router;
