require("express-async-errors");
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const routes = require("../routes");
const { swaggerSpec, swaggerUi } = require("../swagger");

const modules = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use("/uploads", express.static(process.cwd() + "/uploads"));
  app.use(fileUpload());
  app.use(routes);
  // Swagger route
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  });
};

module.exports = modules;
