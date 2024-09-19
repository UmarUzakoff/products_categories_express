const Users = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("../utils/jwt");
const {
  validateRegister,
  validateLogin,
} = require("../validation/user.validation");

// ---------------------- REGISTER ----------------------
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // VALIDATION
  const { error } = validateRegister(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Check if the user already exists
  const existingUser = await Users.findOne({ email });
  if (existingUser) {
    return res
      .status(409)
      .json({ error: "User with this email already exists!" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create the new user
  const user = await Users.create({
    name,
    email,
    password: hashedPassword,
  });

  // Generate a JWT token
  const token = jwt.sign({ id: user._id, role: user.role });

  res.status(201).json({ message: "User registered successfully!", token });
};

// ---------------------- LOGIN ----------------------
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // VALIDATION
  const { error } = validateLogin(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Check if the user exists
  const user = await Users.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password!" });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid email or password!" });
  }

  // Generate a JWT token
  const token = jwt.sign({ id: user._id, role: user.role });

  res.status(200).json({ message: "Login successful!", token });
};
// ---------------------- GET PROFILE ----------------------
exports.getProfile = async (req, res) => {
  const user = await Users.findById(req.verifiedUser.id).select("-password");
  if (!user) {
    return res.status(404).json({ error: "User not found!" });
  }
  res.status(200).json(user);
};

// ---------------------- GET ALL USERS (Only Admin) ----------------------

exports.getAllUsers = async (req, res) => {
  const users = await Users.find();
  res.status(200).json(users);
};
