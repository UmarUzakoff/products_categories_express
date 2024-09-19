require("express-async-errors");
const express = require("express");
const cors = require("cors");
const routes = require("../routes");

const modules = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(routes);
  app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  });
};

module.exports = modules;
