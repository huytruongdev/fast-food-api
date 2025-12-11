const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
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

const DB_URI =
  "mongodb+srv://admin:admin123@test.vzbuawu.mongodb.net/?appName=Test";

mongoose
  .connect(DB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("❌ DB error:", err.message));

app.use("/", authRoutes);
app.use("/", categoryRoutes);
app.use("/products", productRoutes);
app.use("/favorites", favoritesRoutes);
app.use("/carts", cartsRoutes);
app.use("/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
