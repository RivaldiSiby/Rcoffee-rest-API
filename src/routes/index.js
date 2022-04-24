const express = require("express");

const Router = express.Router();

// routes list
const storeRouter = require("./store");
const usersRouter = require("./users");
const productRouter = require("./product");

Router.use("/store", storeRouter);
Router.use("/users", usersRouter);
Router.use("/product", productRouter);

module.exports = Router;
