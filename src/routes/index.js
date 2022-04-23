const express = require("express");

const Router = express.Router();

// routes list
const storeRouter = require("./store");

Router.use("/store", storeRouter);

module.exports = Router;
