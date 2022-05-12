const express = require("express");

const Router = express.Router();

const productController = require("../controllers/product");
const productValidator = require("../middlewares/validator/product/index");
const auth = require("../middlewares/auth/auth");
const {
  readProductById,
  readProducts,
  createProduct,
  editProductById,
  deleteProductById,
} = productController;

// Router list

Router.get("/", auth.checkToken, readProducts);
Router.get("/:id", auth.checkToken, readProductById);
Router.post(
  "/",
  auth.checkToken,
  auth.checkRole,
  productValidator.productValidatorPost.validator,
  createProduct
);
Router.patch(
  "/:id",
  auth.checkToken,
  auth.checkRole,
  productValidator.productValidatorPatch.validator,
  editProductById
);
Router.delete("/:id", auth.checkToken, auth.checkRole, deleteProductById);

module.exports = Router;
