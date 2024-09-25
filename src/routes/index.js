const users = require("./users.routes");
const categories = require("./categories.routes");
const products = require("./products.routes");
const comments = require("./comments.routes");

module.exports = [users, categories, products, comments];
