const express = require("express");
const Router = express.Router();
const auth = require("../middlewares/auth/auth");
const authController = require("../controllers/auth");
const authValidator = require("../middlewares/validator/auth/index");

// routes auth
Router.post(
  "/",
  authValidator.authValidatorSignIn.validator,
  authController.signIn
);
Router.get("/:refresh", auth.checkRefresh);
Router.get("/confirmEmail", authController.checkConfirmEmail);
Router.get("/confirmPassword", authController.checkConfirmPassword);
Router.get("/forgotPassword", authController.forgotPassword);
Router.get("/resetPassword", authController.resetPassword);
Router.delete("/:refresh", authController.logOut);
Router.post(
  "/register",
  auth.checkDuplicate,
  authValidator.authValidatorRegis.validator,
  authController.register
);

module.exports = Router;
