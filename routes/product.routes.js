const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controllers");

const upload = require("../middlewares/uploadFile");
const validation = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

router.get("/products", productController.getProducts);

router.post(
  "/products",
  [validation, isAdmin, upload],
  productController.createProduct
);

router.put(
  "/products/:id",
  [validation, isAdmin, upload],
  productController.uploadProduct
);

router.delete(
  "/products/:id",
  [validation, isAdmin],
  productController.deleteProducst
);

router.get("/products/:id", productController.getProducstById);

module.exports = router;
