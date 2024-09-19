const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const validateRegister = (user) => registerSchema.validate(user);
const validateLogin = (user) => loginSchema.validate(user);

module.exports = {
  validateRegister,
  validateLogin,
};
