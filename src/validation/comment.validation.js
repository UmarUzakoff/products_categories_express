const Joi = require("joi");

const commentSchema = Joi.object({
  comment: Joi.string().required(),
  user_id: Joi.string().required(),
  product_id: Joi.string().required(),
});

const validateComment = (comment) => commentSchema.validate(comment);

module.exports = { validateComment };
