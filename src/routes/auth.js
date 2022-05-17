const express = require("express");
const Router = express.Router();
const auth = require("../middlewares/auth/auth");
const authController = require("../controllers/auth");
const authValidator = require("../middlewares/validator/auth/index");
const ClientError = require("../exceptions/ClientError");
const response = require("../helper/response");
const upload = require("../middlewares/files/upload");
const multer = require("multer");
const uploadHandler = upload.imageUploadUser.single("photo");
// routes auth
Router.post(
  "/",
  authValidator.authValidatorSignIn.validator,
  authController.signIn
);
Router.post(
  "/register",
  auth.checkDuplicate,
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
  authValidator.authValidatorRegis.validator,
  authController.register
);

module.exports = Router;
