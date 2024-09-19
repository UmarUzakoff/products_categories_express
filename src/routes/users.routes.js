const { Router } = require("express");
const {
  register,
  login,
  getProfile,
  getAllUsers,
} = require("../controllers/user.controller");

// Middlewares
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/auth.middleware");

const router = new Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.get("/admin", authMiddleware, adminMiddleware, (req, res) => {
  res.status(200).json({ message: "Welcome, Admin!" });
});
router.get("/admin/users", authMiddleware, adminMiddleware, getAllUsers);

module.exports = router;
