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

    const io = req.app.get("socketio");

    io.emit("new_order_available", order);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/pending", async (req, res) => {
  try {
    const orders = await Order.find({ status: "pending" }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/accept/:id", async (req, res) => {
  try {
    const { shipperId } = req.body;

    const orderId = req.params.id;
    const order = await Order.findOneAndUpdate(
      { _id: orderId, status: "pending" },
      {
        status: "accepted",
        shipperId: shipperId,
      },
      { new: true }
    );

    if (!order) {
      return res
        .status(400)
        .json({
          message: "Đơn hàng không tồn tại hoặc đã bị người khác nhận.",
        });
    }

    const io = req.app.get("socketio");

    io.to(orderId).emit("order_status_update", {
      orderId: orderId,
      status: "accepted",
      shipperId: shipperId,
    });

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/update-status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["shipping", "arrived", "delivered"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }
    const orderId = req.params.id;
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    const io = req.app.get("socketio");

    io.to(orderId).emit("order_status_update", {
      status: status,
      orderId: orderId,
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/driver/:shipperId", async (req, res) => {
  try {
    const { shipperId } = req.params;

    const orders = await Order.find({
      shipperId: shipperId,
      status: { $ne: "pending" },
    }).sort({ updatedAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "shipperInfo",
        select: "username phone_number",
      });
    res.status(200).json(orders);
  } catch (err) {
    console.error("Lỗi lấy lịch sử đơn hàng:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
