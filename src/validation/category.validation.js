const Joi = require("joi");

const categorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
});

const validateCategory = (category) => categorySchema.validate(category);

module.exports = { validateCategory };
