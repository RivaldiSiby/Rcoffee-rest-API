const express = require("express");

const Router = express.Router();

const productController = require("../controllers/product");
const productValidator = require("../middlewares/validator/product/index");
const {
  readProductById,
  readProducts,
  createProduct,
  editProductById,
  deleteProductById,
} = productController;

// Router list

Router.get("/", readProducts);
Router.get("/:id", readProductById);
Router.post(
  "/",
  productValidator.productValidatorPost.validator,
  createProduct
);
Router.put(
  "/:id",
  productValidator.productValidatorPut.validator,
  editProductById
);
Router.delete("/:id", deleteProductById);

module.exports = Router;
