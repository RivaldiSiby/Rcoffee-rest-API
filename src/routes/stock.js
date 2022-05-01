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

Router.get("/", readStocks);
Router.get("/:id", readStockById);
Router.post("/", stockValidator.validatorPost, createdNewStock);
Router.patch("/:id", stockValidator.validatorPatch, editStockById);
Router.delete("/:id", deleteStockById);

module.exports = Router;
