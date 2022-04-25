const express = require("express");

const Router = express.Router();

const stockController = require("../controllers/stock");

const {
  readStockById,
  readStocks,
  createdNewStock,
  editStockById,
  deleteStockById,
} = stockController;

Router.get("/", readStocks);
Router.get("/:id", readStockById);
Router.post("/", createdNewStock);
Router.put("/:id", editStockById);
Router.delete("/:id", deleteStockById);

module.exports = Router;
