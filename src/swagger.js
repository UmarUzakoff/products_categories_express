const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mini Market",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      {
        url: "http://localhost:4567", // Replace with your actual server URL
      },
    ],
    tags: [
      {
        name: "Users",
        description: "User management"
      },
      {
        name: "Categories",
        description: "Category management"
      },
      {
        name: "Products",
        description: "Product management"
      },
      {
        name: "Comments",
        description: "Comment management"
      }
    ],
  },
  apis: ["./src/routes/*.js"], // Path to the route files
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
