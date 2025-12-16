const router = require("express").Router();
const {
  getProductsByCategory,
  getAllProducts,
  getProductsByIds,
  getAllProductsPaginate,
} = require("../Controller/productController");

router.get("/", getAllProducts);
router.get("/categories/:categoryId", getProductsByCategory);
router.post("/byIds", getProductsByIds);
router.get("/paginate", getAllProductsPaginate);


module.exports = router;
