const express = require("express");

const Router = express.Router();
const promosValidator = require("../middlewares/validator/promos/index");
const promosController = require("../controllers/promos");
const {
  readPromosAll,
  readPromosById,
  createPromos,
  editPromosById,
  deletePromosById,
} = promosController;

// router list
Router.get("/", readPromosAll);
Router.get("/:id", readPromosById);
Router.post("/", promosValidator.promosValidatorPost.validator, createPromos);
Router.patch(
  "/:id",
  promosValidator.promosValidatorPatch.validator,
  editPromosById
);
Router.delete("/:id", deletePromosById);

module.exports = Router;
