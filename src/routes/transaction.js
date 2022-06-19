const express = require("express");

const Router = express.Router();

const transactionController = require("../controllers/transaction");
const transactionValidator = require("../middlewares/validator/transaction/index");

const {
  readLastDay,
  createTransaction,
  readAllData,
  readDetailTransactionById,
  softDeleteTransaction,
} = transactionController;
const auth = require("../middlewares/auth/auth");

// route list
Router.post(
  "/",
  auth.checkToken,
  transactionValidator.validator,
  createTransaction
);
Router.patch("/delete", auth.checkToken, softDeleteTransaction);
Router.get("/", auth.checkToken, readAllData);
Router.get("/daily", auth.checkToken, auth.checkRole, readLastDay);
Router.get("/:id", auth.checkToken, readDetailTransactionById);

module.exports = Router;
