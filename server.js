const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require('http');
const { Server } = require('socket.io');

// Import Routes
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const favoritesRoutes = require("./routes/favorite");
const cartsRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

app.set('socketio', io);

const DB_URI = "mongodb+srv://admin:admin123@test.vzbuawu.mongodb.net/?appName=Test";

mongoose
    .connect(DB_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.log("❌ DB error:", err.message));

app.use("/", authRoutes);
app.use("/", categoryRoutes);
app.use("/products", productRoutes);
app.use("/favorites", favoritesRoutes);
app.use("/carts", cartsRoutes);
app.use("/orders", orderRoutes);

io.on('connection', (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);

    // Sự kiện: Join Room
    socket.on('join_order', (orderId) => {
        socket.join(orderId);
        console.log(`Socket ${socket.id} joined room: ${orderId}`);
    });

    // Sự kiện: Tài xế gửi vị trí
    socket.on('driver_send_location', (data) => {
        const roomId = String(data.orderId).trim();

        // Debug log
        const room = io.sockets.adapter.rooms.get(roomId);
        const numClients = room ? room.size : 0;
        console.log(`👉 Sending loc to room: "${roomId}" - Clients: ${numClients}`);

        // Gửi tọa độ cho Khách hàng trong phòng
        io.to(roomId).emit('delivery_location_update', {
            lat: data.lat,
            lng: data.lng,
            heading: data.heading
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// 6. Chạy Server
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});