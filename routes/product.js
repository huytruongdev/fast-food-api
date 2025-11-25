const router = require("express").Router();
const {
  getProductsByCategory,
  getAllProducts,
  getProductsByIds,
} = require("../Controller/productController");

router.get("/", getAllProducts);
router.get("/categories/:categoryId", getProductsByCategory);
router.post("/byIds", getProductsByIds);

module.exports = router;
