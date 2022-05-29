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
Router.get("/:refresh", auth.checkToken, (req, res) => {
  response.isSuccessNoData(res, 200, " you are already signed in");
});
Router.delete("/:refresh", auth.checkToken, authController.logOut);
Router.post(
  "/register",
  auth.checkDuplicate,
  authValidator.authValidatorRegis.validator,
  authController.register
);

module.exports = Router;
