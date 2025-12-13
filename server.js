const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const favoritesRoutes = require("./routes/favorite");
const cartsRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const DB_URI =
  "mongodb+srv://admin:admin123@test.vzbuawu.mongodb.net/?appName=Test";

mongoose
  .connect(DB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("DB error:", err.message));

app.use("/", authRoutes);
app.use("/", categoryRoutes);
app.use("/products", productRoutes);
app.use("/favorites", favoritesRoutes);
app.use("/carts", cartsRoutes);
app.use("/orders", orderRoutes);

const io = new Server(server, {
  cors: { origin: "*" }
});

io.on('connection', (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);

    // 1. SỰ KIỆN: JOIN ROOM
    // Cả App Khách và App Tài xế đều phải emit event này khi vào màn hình bản đồ
    socket.on('join_order', (orderId) => {
        socket.join(orderId);
        console.log(`Socket ${socket.id} joined room: ${orderId}`);
    });

    // 2. SỰ KIỆN: NHẬN VỊ TRÍ TỪ TÀI XẾ
    // App Tài xế (hoặc Script giả lập) sẽ emit event này
    socket.on('driver_send_location', (data) => {
        // data format mong đợi: 
        // { 
        //   orderId: "ORD123", 
        //   lat: 10.762..., 
        //   lng: 106.660..., 
        //   heading: 45.0 
        // }
        console.log(data);

        console.log(`📍 Location update for ${data.orderId}:`, data.lat, data.lng);

        // 3. SỰ KIỆN: BẮN VỊ TRÍ TỚI KHÁCH HÀNG
        // Chỉ gửi cho những ai đang ở trong room 'orderId' đó
        // Tên event 'delivery_location_update' phải trùng khớp với code Flutter
        io.to(data.orderId).emit('delivery_location_update', {
            lat: data.lat,
            lng: data.lng,
            heading: data.heading
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
