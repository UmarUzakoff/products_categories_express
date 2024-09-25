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

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Smith
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johnsmith@gmail.com
 *               password:
 *                 type: string
 *                 example: 1234
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Registered successfully!
 *                 token:
 *                   type: string
 *                   example: your_jwt_token
 *       400:
 *         description: Validation error!
 *       409:
 *         description: User with this email already exists!
 */
router.post("/register", register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johnsmith@gmail.com
 *               password:
 *                 type: string
 *                 example: 1234
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully logged in!
 *                 token:
 *                   type: string
 *                   example: your_jwt_token
 *       400:
 *         description: Validation error!
 *       401:
 *         description: Invalid email or password!
 */
router.post("/login", login);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: 'Enter your bearer token in the format **Bearer &lt;token&gt;**'
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []  # This references the security scheme defined above
 *     responses:
 *       200:
 *         description: User profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "66e937c90c1b7ccd93309872"
 *                 name:
 *                   type: string
 *                   example: John Smith
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: johnsmith@gmail.com
 *                 role:
 *                   type: string
 *                   example: user
 *       401:
 *         description: No token, authorization denied!
 *       404:
 *         description: User not found!
 */
router.get("/profile", authMiddleware, getProfile);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (Only Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "66e937c90c1b7ccd93309872"
 *                   name:
 *                     type: string
 *                     example: John Smith
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: johnsmith@gmail.com
 *                   role:
 *                     type: string
 *                     example: user
 *       401:
 *         description: No token, authorization denied!
 *       403:
 *         description: Access denied. Admins only!
 */
router.get("/admin/users", authMiddleware, adminMiddleware, getAllUsers);

module.exports = router;

