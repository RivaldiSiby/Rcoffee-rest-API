const express = require("express");
const Router = express.Router();

const usersController = require("../controllers/users");
const usersValidator = require("../middlewares/validator/users/index");
const { readUsers, readUserById, createUser, editUserById, deleteUserById } =
  usersController;

const auth = require("../middlewares/auth/auth");

Router.get("/", auth.checkToken, auth.checkRole, readUsers);
Router.get("/profile", auth.checkToken, readUserById);
Router.post(
  "/",
  auth.checkToken,
  auth.checkRole,
  usersValidator.usersValidatorPost.validator,
  createUser
);
Router.patch(
  "/",
  auth.checkToken,
  usersValidator.usersValidatorPatch.validator,
  editUserById
);
Router.delete("/:id", auth.checkToken, auth.checkRole, deleteUserById);

module.exports = Router;
