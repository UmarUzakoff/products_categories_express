const { Router } = require("express");
const {
  postComment,
  editComment,
  deleteComment,
} = require("../controllers/comments.controller");

// Middlewares
const { authMiddleware } = require("../middlewares/auth.middleware");
const ID_Validation = require("../middlewares/ID_Validation.middleware");

const router = new Router();

/**
 * @swagger
 * /products/{id}/comments:
 *   post:
 *     summary: Post a comment on a product
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successful post of a comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comment posted successfully!
 *       400:
 *         description: Invalid ID format!
 *       401:
 *         description: No token, authorization denied!
 *       404:
 *         description: Product not found!
 */
router.post(
  "/products/:id/comments",
  ID_Validation,
  authMiddleware,
  postComment
);

/**
 * @swagger
 * /products/comments/{id}:
 *   put:
 *     summary: Edit a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the comment to edit
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful update of a comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comment updated successfully!
 *       400:
 *         description: Invalid comment ID format!
 *       401:
 *         description: No token, authorization denied!
 *       403:
 *         description: You can only edit your own comments!
 *       404:
 *         description: Comment not found
 */
router.put(
  "/products/comments/:id",
  ID_Validation,
  authMiddleware,
  editComment
);

/**
 * @swagger
 * /products/comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the comment to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comment deleted successfully!
 *       400:
 *         description: Invalid ID format!
 *       401:
 *         description: No token, authorization denied!
 *       403:
 *         description: You can only delete your own comments!
 *       404:
 *         description: Comment not found!
 */
router.delete(
  "/products/comments/:id",
  ID_Validation,
  authMiddleware,
  deleteComment
);

module.exports = router;
