const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().required(),
  color: Joi.string().required(),
  price: Joi.string().required(),
  quantity: Joi.number().required(),
  category: Joi.string().required(),
});

const validateProduct = (product) => productSchema.validate(product);

module.exports = { validateProduct };
