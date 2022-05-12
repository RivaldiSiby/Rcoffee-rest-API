const express = require("express");

const Router = express.Router();
const promosValidator = require("../middlewares/validator/promos/index");
const promosController = require("../controllers/promos");
const auth = require("../middlewares/auth/auth");
const {
  readPromosAll,
  readPromosById,
  createPromos,
  editPromosById,
  deletePromosById,
} = promosController;

// router list
Router.get("/", auth.checkToken, auth.checkRole, readPromosAll);
Router.get("/:id", auth.checkToken, readPromosById);
Router.post(
  "/",
  auth.checkToken,
  auth.checkRole,
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
