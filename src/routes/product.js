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
const multer = require("multer");
const uploadHandler = upload.imageUploadProduct.single("photo");
// Router list

Router.get("/", auth.checkToken, readProducts);
Router.get("/:id", auth.checkToken, readProductById);
Router.post(
  "/",
  auth.checkToken,
  auth.checkRole,
  function (req, res, next) {
    uploadHandler(req, res, function (err) {
      if (err) {
        console.log(err.message);
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          return response.isError(res, 400, err.message);
        }
        if (err instanceof ClientError) {
          return response.isError(res, err.statusCode, err.message);
        }
        if (err) {
          return response.isError(
            res,
            500,
            "Sorry, there was a failure on our server"
          );
        }
      }

      next();
    });
  },
  productValidator.productValidatorPost.validator,
  createProduct
);
Router.patch(
  "/:id",
  auth.checkToken,
  auth.checkRole,

  function (req, res, next) {
    uploadHandler(req, res, function (err) {
      if (err) {
        console.log(err.message);
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          return response.isError(res, 400, err.message);
        }
        if (err instanceof ClientError) {
          return response.isError(res, err.statusCode, err.message);
        }
        if (err) {
          return response.isError(
            res,
            500,
            "Sorry, there was a failure on our server"
          );
        }
      }

      next();
    });
  },
  productValidator.productValidatorPatch.validator,
  editProductById
);
Router.delete("/:id", auth.checkToken, auth.checkRole, deleteProductById);

module.exports = Router;
