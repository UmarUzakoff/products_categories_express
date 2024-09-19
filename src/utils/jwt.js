const jwt = require("jsonwebtoken");
const config = require("../../config/config");

const SECRET_KEY = config.SECRET_KEY;

const verify = (payload) => jwt.verify(payload, SECRET_KEY);
const sign = (payload) => jwt.sign(payload, SECRET_KEY);

module.exports = {
  sign,
  verify,
};
