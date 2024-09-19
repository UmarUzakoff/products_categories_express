const { Router } = require("express");
const {
  getProducts,
  postProduct,
  getExactProduct,
  deleteProduct,
  editProduct,
} = require("../controllers/products.controller");

// Middlewares
const ID_Validation = require("../middlewares/ID_Validation.middleware");
const {
  adminMiddleware,
  authMiddleware,
} = require("../middlewares/auth.middleware");

const router = new Router();

router.get("/products", getProducts);
router.get("/products/:id", ID_Validation, getExactProduct);
router.post("/products", authMiddleware, adminMiddleware, postProduct);
router.delete(
  "/products/:id",
  ID_Validation,
  authMiddleware,
  adminMiddleware,
  deleteProduct
);
router.put(
  "/products/:id",
  ID_Validation,
  authMiddleware,
  adminMiddleware,
  editProduct
);

module.exports = router;
