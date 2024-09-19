const { isValidObjectId } = require("mongoose");

const ID_Validation = (req, res, next) => {
  const { id } = req.params;

  // Validate if 'id' is a valid ObjectId
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid product ID format" });
  }

  next();
};

module.exports = ID_Validation;
