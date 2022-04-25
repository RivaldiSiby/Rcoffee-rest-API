const express = require("express");

const Router = express.Router();

// routes list
const storeRouter = require("./store");
const usersRouter = require("./users");
const productRouter = require("./product");
const stockRouter = require("./stock");
const promosRouter = require("./promos");

Router.use("/store", storeRouter);
Router.use("/users", usersRouter);
Router.use("/product", productRouter);
Router.use("/stock", stockRouter);
Router.use("/promos", promosRouter);

module.exports = Router;
