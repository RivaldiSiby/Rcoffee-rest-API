const express = require("express");

const Router = express.Router();

const transactionController = require("../controllers/transaction");
const transactionValidator = require("../middlewares/validator/transaction/index");
const { createTransaction, readAllData, readDetailTransactionById } =
  transactionController;
const auth = require("../middlewares/auth/auth");

// route list
Router.post(
  "/",
  auth.checkToken,
  auth.checkUserId,
  transactionValidator.validator,
  createTransaction
);
Router.get("/", auth.checkToken, auth.checkUserId, readAllData);
Router.get(
  "/:id",
  auth.checkToken,
  auth.checkUserId,
  readDetailTransactionById
);

module.exports = Router;
