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
const fileUpload = require("../middlewares/fileUpload.middleware");

const router = new Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve all products or filter by category
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter products by category ID
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: Filter products by minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: Filter products by maximum price
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *         description: Filter products by color
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter products by name (partial match)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort products (e.g., "price:asc" or "name:desc")
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products per page
 *     responses:
 *       '200':
 *         description: A list of products
 *       '404':
 *         description: No products found
 */
router.get("/products", getProducts);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Elma - wet wipes
 *               image:
 *                 type: file
 *                 example: The image file to upload
 *               color:
 *                 type: string
 *                 example: blue
 *               price:
 *                 type: string
 *                 example: 700
 *               quantity:
 *                 type: integer
 *                 example: 33
 *               category:
 *                 type: string
 *                 example: 66ebb4c01874c657e2301bce
 *     responses:
 *       201:
 *         description: Successful creation of a product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product created successfully!
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token, authorization denied!
 *       403:
 *         description: Access denied. Admins only!
 *       404:
 *         description: Category not found!
 *       409:
 *         description: Product with this name already exists!
 */
router.post(
  "/products",
  authMiddleware,
  adminMiddleware,
  fileUpload,
  postProduct
);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retrieve a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single product
 *       400:
 *         description: Invalid ID format!
 *       404:
 *         description: Product not found!
 */
router.get("/products/:id", ID_Validation, getExactProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Edit a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to edit
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Elma - wet wipes
 *               image:
 *                 type: file
 *                 example: The image file to upload
 *               color:
 *                 type: string
 *                 example: green
 *               price:
 *                 type: string
 *                 example: 900
 *               quantity:
 *                 type: integer
 *                 example: 33
 *               category:
 *                 type: string
 *                 example: 66ebb4c01874c657e2301bce
 *     responses:
 *       200:
 *         description: Successful update of product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product updated successfully!
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token, authorization denied!
 *       403:
 *         description: Access denied. Admins only!
 *       404:
 *         description: Product not found! | Category not found!
 *       409:
 *         description: Another product with this name already exists
 */
router.put(
  "/products/:id",
  ID_Validation,
  authMiddleware,
  adminMiddleware,
  fileUpload,
  editProduct
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully!
 *       400:
 *         description: Invalid ID format!
 *       401:
 *         description: No token, authorization denied!
 *       403:
 *         description: Access denied. Admins only!
 *       404:
 *         description: Product not found!
 */
router.delete(
  "/products/:id",
  ID_Validation,
  authMiddleware,
  adminMiddleware,
  deleteProduct
);

module.exports = router;
