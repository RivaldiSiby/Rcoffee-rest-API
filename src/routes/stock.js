const express = require("express");

const Router = express.Router();

const stockController = require("../controllers/stock");
const stockValidator = require("../middlewares/validator/stock/index");
const {
  readStockById,
  readStocks,
  createdNewStock,
  editStockById,
  deleteStockById,
} = stockController;
const auth = require("../middlewares/auth/auth");

Router.get("/", auth.checkToken, auth.checkRole, readStocks);
Router.get("/:id", auth.checkToken, auth.checkRole, readStockById);
Router.post(
  "/",
  auth.checkToken,
  auth.checkRole,
  stockValidator.validatorPost,
  createdNewStock
);
Router.patch(
  "/:id",
  auth.checkToken,
  auth.checkRole,
  stockValidator.validatorPatch,
  editStockById
);
Router.delete("/:id", auth.checkToken, auth.checkRole, deleteStockById);

module.exports = Router;
