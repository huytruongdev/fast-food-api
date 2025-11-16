const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// GET all categories
router.get("/categories", async (req, res) => {
  try {
    const data = await Category.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching categories" });
  }
});

module.exports = router;
