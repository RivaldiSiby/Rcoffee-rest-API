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
Router.post(
  "/register",
  authValidator.authValidatorRegis.validator,
  auth.checkDuplicate,
  authController.register
);

module.exports = Router;
