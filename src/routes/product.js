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
  readFavoriteProducts,
  readJustProducts,
  softDeleteProduct,
} = productController;
const uploadHandler = require("../middlewares/files/files");
// Router list

Router.get("/", readProducts);
Router.get("/product", auth.checkToken, auth.checkRole, readJustProducts);
Router.get("/favorite", readFavoriteProducts);
Router.get("/:id", readProductById);
Router.post(
  "/",
  auth.checkToken,
  auth.checkRole,
  uploadHandler.uploadProduct,
  productValidator.productValidatorPost.validator,
  createProduct
);
Router.patch(
  "/:id",
  auth.checkToken,
  auth.checkRole,
  uploadHandler.uploadProduct,
  productValidator.productValidatorPatch.validator,
  editProductById
);
Router.delete("/:id", auth.checkToken, auth.checkRole, softDeleteProduct);

module.exports = Router;
