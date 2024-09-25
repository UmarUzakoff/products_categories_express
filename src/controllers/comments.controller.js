const { isValidObjectId } = require("mongoose");
const Comments = require("../models/Comment");
const Products = require("../models/Product");
const { validateComment } = require("../validation/comment.validation");

// ------------------------------------POST COMMENT------------------------------

exports.postComment = async (req, res) => {
  const { comment } = req.body;
  const { id: product_id } = req.params;
  const { id: user_id } = req.verifiedUser;

  // VALIDATION
  if (!isValidObjectId(product_id)) {
    return res.status(400).json({ error: "Invalid ID format!" });
  }

  const { error } = validateComment({ comment, user_id, product_id });
  if (error) {
    return res.status(403).json({ error: error.message });
  }

  // CHECK IF PRODUCT EXISTS
  const isProduct = await Products.findById(product_id);
  if (!isProduct) {
    return res.status(404).json({ error: "Product not found!" });
  }

  // CREATE NEW COMMENT
  const newComment = await Comments.create({
    comment,
    user_id,
    product_id,
  });

  // ADD COMMENT TO PRODUCT'S COMMENTS ARRAY
  isProduct.comments.push(newComment._id);
  await isProduct.save();

  res.status(201).json({ message: "Comment posted successfully!" });
};

// ------------------------------------EDIT COMMENT------------------------------

exports.editComment = async (req, res) => {
  const { id: comment_id } = req.params; // Comment ID passed in the URL
  const { comment } = req.body; // New comment content
  const { id: user_id } = req.verifiedUser; // User who is editing the comment

  // VALIDATE COMMENT ID
  if (!isValidObjectId(comment_id)) {
    return res.status(400).json({ error: "Invalid comment ID format!" });
  }

  // CHECK IF COMMENT EXISTS
  const existingComment = await Comments.findById(comment_id);
  if (!existingComment) {
    return res.status(404).json({ error: "Comment not found!" });
  }

  // CHECK IF THE COMMENT BELONGS TO THE USER
  if (existingComment.user_id.toString() !== user_id) {
    return res
      .status(403)
      .json({ error: "You can only edit your own comments!" });
  }

  // UPDATE COMMENT CONTENT
  await Comments.findByIdAndUpdate(comment_id, {
    $set: { comment },
  });

  res.status(200).json({ message: "Comment updated successfully!" });
};

// ------------------------------------DELETE COMMENT----------------------------

exports.deleteComment = async (req, res) => {
  const { id: comment_id } = req.params;
  const { id: user_id } = req.verifiedUser;

  // VALIDATE COMMENT ID
  if (!isValidObjectId(comment_id)) {
    return res.status(400).json({ error: "Invalid comment ID format!" });
  }

  // CHECK IF COMMENT EXISTS
  const existingComment = await Comments.findById(comment_id);
  if (!existingComment) {
    return res.status(404).json({ error: "Comment not found!" });
  }

  // CHECK IF THE COMMENT BELONGS TO THE USER
  if (existingComment.user_id.toString() !== user_id) {
    return res
      .status(403)
      .json({ error: "You can only delete your own comments!" });
  }

  // DELETE THE COMMENT
  await Comments.findByIdAndDelete(comment_id);

  // REMOVE COMMENT FROM THE PRODUCT'S COMMENTS ARRAY
  await Products.updateOne(
    { _id: existingComment.product_id },
    { $pull: { comments: comment_id } } // Pull the comment ID from the product's comments array
  );

  res.status(200).json({ message: "Comment deleted successfully!" });
};
