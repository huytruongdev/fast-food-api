const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/", async (req, res) => {
  try {
    const order = await Order.create({
      ...req.body,
      status: "pending",
      shipperId: null,
    });

    res.status(201).json(order);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
});

router.get("/pending", async (req, res) => {
  try {
    const orders = await Order.find({ status: "pending" });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/accept/:id", async (req, res) => {
  try {
    const { shipperId } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: "accepted",
        shipperId: shipperId,
      },
      { new: true }
    );

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId: userId }).sort({ createdAt: -1 });

    if (!orders) {
        return res.status(200).json([]);
    }

    res.status(200).json(orders);
  } catch (err) {
    console.error("Lỗi lấy lịch sử đơn hàng:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
