const express = require("express");

const Router = express.Router();

const productController = require("../controllers/product");

const {
  readProductById,
  readProductsAll,
  createProduct,
  editProductById,
  deleteProductById,
  findProduct,
} = productController;

// Router list

Router.get("/", findProduct);
Router.get("/all", readProductsAll);
Router.get("/:id", readProductById);
Router.post("/", createProduct);
Router.put("/:id", editProductById);
Router.delete("/:id", deleteProductById);

module.exports = Router;
