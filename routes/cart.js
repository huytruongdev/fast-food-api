const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

router.get("/:userId", async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.params.userId });

    const result = items.map((item) => ({
      id: item._id.toString(),
      productId: item.productId,
      productData: item.productData,
      quantity: item.quantity,
      userId: item.userId,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/add", async (req, res) => {
  try {
    const newItem = await Cart.create({
      productId: req.body.productId,
      productData: req.body.productData,
      quantity: req.body.quantity,
      userId: req.body.userId,
    });

    res.json({
      message: "Added",
      id: newItem._id.toString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    await Cart.findByIdAndUpdate(req.params.id, {
      quantity: req.body.quantity,
    });

    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
