const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
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

router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await Cart.findOneAndDelete({ userId: userId });

    if (!result) {
      return res
        .status(200)
        .json({ message: "Giỏ hàng đã trống hoặc không tồn tại." });
    }
    res.status(200).json({ message: "Giỏ hàng đã được xóa thành công." });
  } catch (error) {
    console.error("Lỗi xóa giỏ hàng:", error);
    res.status(500).json({ message: "Lỗi server khi xóa giỏ hàng." });
  }
});

module.exports = router;
