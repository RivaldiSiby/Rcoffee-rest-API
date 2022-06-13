const express = require("express");

const Router = express.Router();
const promosValidator = require("../middlewares/validator/promos/index");
const promosController = require("../controllers/promos");
const auth = require("../middlewares/auth/auth");
const ClientError = require("../exceptions/ClientError");
const response = require("../helper/response");
const upload = require("../middlewares/files/upload");
const multer = require("multer");
const uploadHandler = upload.imageUploadPromo.single("photo");
const {
  readPromosAll,
  readPromosById,
  createPromos,
  editPromosById,
  deletePromosById,
} = promosController;

// router list
Router.get("/", readPromosAll);
Router.get("/:id", auth.checkToken, readPromosById);
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
  promosValidator.promosValidatorPost.validator,
  createPromos
);
Router.patch(
  "/:id",
  auth.checkToken,
  auth.checkRole,
  promosValidator.promosValidatorPatch.validator,
  editPromosById
);
Router.delete("/:id", auth.checkToken, auth.checkRole, deletePromosById);

module.exports = Router;
