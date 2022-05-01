const express = require("express");
const Router = express.Router();

const usersController = require("../controllers/users");
const usersValidator = require("../middlewares/validator/users/index");
const { readUsers, readUserById, createUser, editUserById, deleteUserById } =
  usersController;

Router.get("/", readUsers);
Router.get("/:id", readUserById);
Router.post("/", usersValidator.usersValidatorPost.validator, createUser);
Router.patch(
  "/:id",
  usersValidator.usersValidatorPatch.validator,
  editUserById
);
Router.delete("/:id", deleteUserById);

module.exports = Router;
