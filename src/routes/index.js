const express = require("express");

const Router = express.Router();

// routes list
const usersRouter = require("./users");
const productRouter = require("./product");
const stockRouter = require("./stock");
const promosRouter = require("./promos");
const transactionRouter = require("./transaction");
const authRouter = require("./auth");
const uploadRouter = require("./upload");

Router.use("/users", usersRouter);
Router.use("/product", productRouter);
Router.use("/stock", stockRouter);
Router.use("/promos", promosRouter);
Router.use("/transaction", transactionRouter);
Router.use("/auth", authRouter);
Router.use("/upload", uploadRouter);

module.exports = Router;
