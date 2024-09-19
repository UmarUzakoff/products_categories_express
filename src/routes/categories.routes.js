const { Router } = require("express");
const {
  postCategory,
  getCategories,
  getExactCategory,
  editCategory,
  deleteCategory,
} = require("../controllers/categories.controller");

// Middlewares
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/auth.middleware");
const ID_Validation = require("../middlewares/ID_Validation.middleware");

const router = new Router();

router.get("/categories", getCategories);
router.get("/categories/:id", ID_Validation, getExactCategory);
router.post("/categories", authMiddleware, adminMiddleware, postCategory);
router.put(
  "/categories/:id",
  ID_Validation,
  authMiddleware,
  adminMiddleware,
  editCategory
);
router.delete(
  "/categories/:id",
  ID_Validation,
  authMiddleware,
  adminMiddleware,
  deleteCategory
);

module.exports = router;
