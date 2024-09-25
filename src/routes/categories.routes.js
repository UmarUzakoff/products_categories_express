const { Router } = require("express");
const {
  getCategories,
  postCategory,
  getExactCategory,
  deleteCategory,
  editCategory,
} = require("../controllers/categories.controller");

// Middlewares
const ID_Validation = require("../middlewares/ID_Validation.middleware");
const {
  adminMiddleware,
  authMiddleware,
} = require("../middlewares/auth.middleware");
const fileUpload = require("../middlewares/fileUpload.middleware");

const router = new Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve a list of categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 1
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "66ebb4c01874c657e2301bce"
 *                       name:
 *                         type: string
 *                         example: "Beauty"
 *                       description:
 *                         type: string
 *                         example: "category of beauty"
 *                       image:
 *                         type: string
 *                         example: "5d157507-107f-4506-afcb-7e69bf7494d9.jpg"
 *       404:
 *         description: No categories found
 */
router.get("/categories", getCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Retrieve a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the category to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A category object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "66ebb4c01874c657e2301bce"
 *                 name:
 *                   type: string
 *                   example: "Beauty"
 *                 description:
 *                   type: string
 *                   example: "category of beauty"
 *                 image:
 *                   type: string
 *                   example: "5d157507-107f-4506-afcb-7e69bf7494d9.jpg"
 *       404:
 *         description: Category not found
 *       400:
 *         description: Invalid category ID format
 */
router.get("/categories/:id", ID_Validation, getExactCategory);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *               description:
 *                 type: string
 *                 example: category of electronics
 *               image:
 *                 type: file
 *                 example: The image file to upload
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Successful creation of a category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category created successfully!
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token, authorization denied!
 *       403:
 *         description: Access denied. Admins only!
 *       409:
 *         description: Category with this name already exists!
 */
router.post(
  "/categories",
  authMiddleware,
  adminMiddleware,
  fileUpload,
  postCategory
);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category by ID
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *               description:
 *                 type: string
 *                 example: category of electronics
 *               image:
 *                 type: file
 *                 example: The image file to upload
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the category to update
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful update of a category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category updated successfully!
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token, authorization denied!
 *       403:
 *         description: Access denied. Admins only!
 *       404:
 *         description: Category not found!
 *       409:
 *         description: Category with this name already exists!
 */
router.put(
  "/categories/:id",
  ID_Validation,
  authMiddleware,
  adminMiddleware,
  fileUpload,
  editCategory
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the category to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category deleted successfully!
 *       400:
 *         description: Invalid ID format!
 *       401:
 *         description: No token, authorization denied!
 *       404:
 *         description: Category not found!
 *       403:
 *         description: Access denied. Admins only!
 */
router.delete(
  "/categories/:id",
  ID_Validation,
  authMiddleware,
  adminMiddleware,
  deleteCategory
);

module.exports = router;
