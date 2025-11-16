const router = require("express").Router();
const {
  getProductsByCategory,
  getAllProducts,
} = require("../Controller/productController");

router.get("/products", getAllProducts);
router.get("/categories/:categoryId", getProductsByCategory);

module.exports = router;
