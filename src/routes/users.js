const express = require("express");
const Router = express.Router();
const usersController = require("../controllers/users");
const usersValidator = require("../middlewares/validator/users/index");
const { readUsers, readUserById, createUser, editUserById, deleteUserById } =
  usersController;
const auth = require("../middlewares/auth/auth");
const owner = require("../middlewares/auth/owner");

const uploadHandler = require("../middlewares/files/files");
// router users
Router.get("/", auth.checkToken, auth.checkRole, readUsers);
Router.get("/profile", auth.checkToken, readUserById);
Router.post(
  "/",
  owner.checkOwnerCode,
  uploadHandler.uploadUser,
  usersValidator.usersValidatorPost.validator,
  createUser
);
Router.patch(
  "/",
  auth.checkToken,
  uploadHandler.uploadUser,
  usersValidator.usersValidatorPatch.validator,
  editUserById
);
Router.delete("/:id", auth.checkToken, auth.checkRole, deleteUserById);

module.exports = Router;
