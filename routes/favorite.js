const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorite");

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const favorites = await Favorite.find({ userId });

    const productIDs = favorites.map((fav) => fav.productId);

    res.json(productIDs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const fav = await Favorite.create({ userId, productId });

    res.json({ success: true, favorite: fav });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const result = await Favorite.deleteOne({ userId, productId });

    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
