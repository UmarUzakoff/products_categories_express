const Categories = require("../models/Category");
const Products = require("../models/Product");
const { validateCategory } = require("../validation/category.validation");

// ------------------------------------POST CATEGORY------------------------------

exports.postCategory = async (req, res) => {
  const { name, description } = req.body;

  // VALIDATION
  const { error } = validateCategory({ name, description });
  if (error) {
    console.log(error.message);
    return res.status(403).json({ error: error.message });
  }

  // CHECK IF CATEGORY EXISTS
  const existingCategory = await Categories.findOne({ name });
  if (existingCategory) {
    return res.status(409).json({ error: "Category already exists!" });
  }

  // CREATE NEW CATEGORY
  await Categories.create({ name, description });
  res.status(201).json({ message: "Category created successfully!" });
};

// ------------------------------------GET CATEGORIES------------------------------

exports.getCategories = async (req, res) => {
  const { name, description, sort, page = 1, limit = 10 } = req.query;

  const pageInt = parseInt(page);
  const limitInt = parseInt(limit);

  // Initialize a filter object to store filtering conditions
  let filter = {};

  // Name filtering (partial match using regex)
  if (name) {
    filter.name = { $regex: name, $options: "i" }; // Case-insensitive partial match
  }

  // Description filtering (partial match using regex)
  if (description) {
    filter.description = { $regex: description, $options: "i" }; // Case-insensitive partial match
  }

  // Sorting logic
  let sortOption = {};
  if (sort) {
    const sortFields = sort.split(":"); // For example, 'name:asc' or 'description:desc'
    const field = sortFields[0]; // e.g., 'name', 'description'
    const order = sortFields[1] === "desc" ? -1 : 1; // 1 for ascending, -1 for descending
    sortOption[field] = order; // Create a dynamic sort object
  }
  
  // Apply filters, sorting, and pagination
  const categories = await Categories.find(filter)
    .sort(sortOption)
    .skip((pageInt - 1) * limitInt)
    .limit(limitInt);

  if (!categories.length) {
    return res.status(404).json({ error: "No categories found!" });
  }

  const totalCategories = await Categories.countDocuments(filter); // Total number of categories that match the filter

  res.status(200).json({
    page: pageInt,
    limit: limitInt,
    total: totalCategories,
    categories,
  });
};

// ------------------------------------GET ONE CATEGORY------------------------------

exports.getExactCategory = async (req, res) => {
  const { id } = req.params;

  // FIND THE CATEGORY BY ID
  const exactCategory = await Categories.findById(id);

  // CHECK IF CATEGORY EXISTS
  if (!exactCategory) {
    return res.status(404).json({ error: "Category not found!" });
  }

  res.status(200).json(exactCategory);
};

// ------------------------------------DELETE CATEGORY------------------------------

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  // CHECK IF CATEGORY EXISTS
  const category = await Categories.findById(id);
  if (!category) {
    return res.status(404).json({ error: "Category not found!" });
  }
  await Products.deleteMany({ category: id });
  await Categories.findByIdAndDelete(id);
  res.status(200).json({ message: "Category deleted successfully!" });
};

// ------------------------------------EDIT CATEGORY------------------------------

exports.editCategory = async (req, res) => {
  const { id } = req.params;

  const { name, description } = req.body;

  // VALIDATION
  const { error } = validateCategory({ name, description });
  if (error) {
    console.log(error.message);
    return res.status(403).json({ error: error.message });
  }

  // CHECK IF CATEGORY EXISTS
  const category = await Categories.findById(id);
  if (!category) {
    return res.status(404).json({ error: "Category not found!" });
  }

  // CHECK IF ANOTHER CATEGORY WITH THE SAME NAME ALREADY EXISTS
  const existingCategory = await Categories.findOne({ name, _id: { $ne: id } });
  if (existingCategory) {
    return res
      .status(409)
      .json({ error: "Another category with this name already exists!" });
  }

  // EDIT
  await Categories.findByIdAndUpdate(id, {
    $set: { name, description },
  });
  res.status(200).json({ message: "Category edited successfully!" });
};
