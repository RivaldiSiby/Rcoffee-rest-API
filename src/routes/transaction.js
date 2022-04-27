const express = require("express");

const Router = express.Router();

const transactionController = require("../controllers/transaction");
const transactionValidator = require("../middlewares/validator/transaction/index");
const { createTransaction, readAllData, readDetailTransactionById } =
  transactionController;

// route list
Router.post("/", transactionValidator.validator, createTransaction);
Router.get("/", readAllData);
Router.get("/:id", readDetailTransactionById);

module.exports = Router;
