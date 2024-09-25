const { isValidObjectId } = require("mongoose");
const Categories = require("../models/Category");
const Products = require("../models/Product");
const { validateProduct } = require("../validation/product.validation");
const fs = require("fs");
const path = require("path");

// ------------------------------------POST PRODUCT------------------------------

exports.postProduct = async (req, res) => {
  const { name, color, price, quantity, category } = req.body;
  const { imageName: product_image } = req;
  const image = req.files?.image;

  // VALIDATION
  const { error } = validateProduct({ name, color, price, quantity, category });
  if (error) {
    console.log(error.message);
    return res.status(400).json({ error: error.message });
  }

  // VALIDATION: Category ID
  if (!isValidObjectId(category)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  const isCategory = await Categories.findById(category);
  if (!isCategory) {
    return res.status(404).json({ error: "Category not found!" });
  }

  // CHECK IF PRODUCT WITH SAME NAME ALREADY EXISTS
  const existingProduct = await Products.findOne({ name });
  if (existingProduct) {
    return res
      .status(409)
      .json({ error: "Product with this name already exists!" });
  }

  // CREATE NEW PRODUCT
  image.mv(`${process.cwd()}/uploads/${product_image}`);
  await Products.create({
    name,
    color,
    price,
    quantity,
    category,
    image: product_image,
  });
  res.status(201).json({ message: "Product created successfully!" });
};

// ------------------------------------GET ALL PRODUCTS OR  BY CATEGORY------------------------------

exports.getProducts = async (req, res) => {
  const {
    category: categoryId,
    minPrice,
    maxPrice,
    color,
    name,
    sort,
    page = 1,
    limit = 10,
  } = req.query;

  const pageInt = parseInt(page);
  const limitInt = parseInt(limit);

  // Initialize a filter object to store filtering conditions
  let filter = {};

  // Category filter
  if (categoryId) {
    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID format!" });
    }

    const isCategory = await Categories.findById(categoryId);
    if (!isCategory) {
      return res.status(404).json({ error: "Category not found!" });
    }

    filter.category = categoryId; // Add category filter
  }

  // Price filtering (minPrice and maxPrice)
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = minPrice;
    if (maxPrice) filter.price.$lte = maxPrice;
  }

  // Color filtering
  if (color) {
    filter.color = color; // Exact match for color
  }

  // Name filtering (partial match using regex)
  if (name) {
    filter.name = { $regex: name, $options: "i" }; // Case-insensitive partial match
  }

  // Sorting logic
  let sortOption = {};
  if (sort) {
    const sortFields = sort.split(":"); // For example, 'price:asc' or 'name:desc'
    const field = sortFields[0]; // e.g., 'price', 'name', or 'color'
    const order = sortFields[1] === "desc" ? -1 : 1; // 1 for ascending, -1 for descending
    sortOption[field] = order; // Create a dynamic sort object
  }

  // Apply filters and pagination
  const products = await Products.find(filter)
    .populate("category")
    .populate({
      path: "comments",
      populate: {
        path: "user_id",
        select: "name", // Only fetch the user's name
      },
    })
    .sort(sortOption) // Sorting logic
    .skip((pageInt - 1) * limitInt)
    .limit(limitInt);

  if (!products.length) {
    return res.status(404).json({ error: "No products found!" });
  }

  const totalProducts = await Products.countDocuments(filter); // Total number of products that match the filter

  res.status(200).json({
    page: pageInt,
    limit: limitInt,
    total: totalProducts,
    products,
  });
};

// ------------------------------------GET ONE PRODUCT------------------------------

exports.getExactProduct = async (req, res) => {
  const { id } = req.params;

  // FIND THE PRODUCT BY ID AND POPULATE COMMENTS
  const exactProduct = await Products.findById(id)
    .populate("category")
    .populate({
      path: "comments", // Populating the comments
      populate: {
        path: "user_id", // Also populate the user who made the comment
        select: "name", // Only select the name field of the user
      },
    });

  // CHECK IF PRODUCT EXISTS
  if (!exactProduct) {
    return res.status(404).json({ error: "Product not found!" });
  }

  res.status(200).json(exactProduct);
};

// ------------------------------------DELETE PRODUCT------------------------------

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  // CHECK IF PRODUCT EXISTS
  const product = await Products.findById(id);
  if (!product) {
    return res.status(404).json({ error: "Product not found!" });
  }

  const imagePath = path.join(process.cwd(), "uploads", product.image);

  // Delete the image file if it exists
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath); // Synchronously delete the image file
  }

  await Products.findByIdAndDelete(id);
  res.status(200).json({ message: "Product deleted successfully!" });
};

// ------------------------------------EDIT PRODUCT------------------------------

exports.editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, color, price, quantity, category } = req.body;
  const { imageName: product_image } = req;
  const image = req.files?.image;

  // VALIDATION
  const { error } = validateProduct({ name, color, price, quantity, category });
  if (error) {
    console.log(error.message);
    return res.status(403).json({ error: error.message });
  }

  // CHECK IF PRODUCT EXISTS
  const product = await Products.findById(id);
  if (!product) {
    return res.status(404).json({ error: "Product not found!" });
  }

  // CHECK IF ANOTHER PRODUCT WITH THE SAME NAME ALREADY EXISTS
  const existingProduct = await Products.findOne({ name, _id: { $ne: id } });
  if (existingProduct) {
    return res
      .status(409)
      .json({ error: "Another product with this name already exists!" });
  }

  // VALIDATION: Category ID
  if (!isValidObjectId(category)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  const isCategory = await Categories.findById(category);
  if (!isCategory) {
    return res.status(404).json({ error: "Category not found!" });
  }

  // EDIT
  const imagePath = path.join(process.cwd(), "uploads", product.image);

  // Delete the image file if it exists
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath); // Synchronously delete the image file
  }

  image.mv(`${process.cwd()}/uploads/${product_image}`);

  await Products.findByIdAndUpdate(id, {
    $set: { name, color, price, quantity, category },
  });
  res.status(200).json({ message: "Product updated successfully!" });
};
