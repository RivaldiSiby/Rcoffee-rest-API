const express = require("express");

const Router = express.Router();
const auth = require("../middlewares/auth/auth");
const authController = require("../controllers/auth");
const authValidator = require("../middlewares/validator/auth/index");
const ClientError = require("../exceptions/ClientError");
const response = require("../helper/response");
const upload = require("../middlewares/files/upload");
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
  (req, res, next) => {
    uploadHandler(req, res, next, (error) => {
      console.log(error);
      if (error instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
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
  authValidator.authValidatorRegis.validator,
  authController.register
);

module.exports = Router;
