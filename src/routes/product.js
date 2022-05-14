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
const ClientError = require("../exceptions/ClientError");
const response = require("../helper/response");
const upload = require("../middlewares/files/upload");
const uploadHandler = upload.imageUploadProduct.single("photo");
// Router list

Router.get("/", auth.checkToken, readProducts);
Router.get("/:id", auth.checkToken, readProductById);
Router.post(
  "/",
  auth.checkToken,
  auth.checkRole,
  productValidator.productValidatorPost.validator,
  (req, res, next) => {
    uploadHandler(req, res, next, (error) => {
      if (error instanceof multer.MulterError) {
        return response.isError(res, 400, error.message);
      }
      if (error instanceof ClientError) {
        return response.isError(res, error.statusCode, error.message);
      }
      if (error) {
        return response.isError(
          res,
          500,
          "Sorry, there was a failure on our server"
        );
      }
      next();
    });
  },
  createProduct
);
Router.patch(
  "/:id",
  auth.checkToken,
  auth.checkRole,
  productValidator.productValidatorPatch.validator,
  (req, res, next) => {
    uploadHandler(req, res, next, (error) => {
      if (error instanceof multer.MulterError) {
        return response.isError(res, 400, error.message);
      }
      if (error instanceof ClientError) {
        return response.isError(res, error.statusCode, error.message);
      }
      if (error) {
        return response.isError(
          res,
          500,
          "Sorry, there was a failure on our server"
        );
      }
      next();
    });
  },
  editProductById
);
Router.delete("/:id", auth.checkToken, auth.checkRole, deleteProductById);

module.exports = Router;
