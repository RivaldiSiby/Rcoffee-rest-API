const express = require("express");
const Router = express.Router();

const usersController = require("../controllers/users");
const usersValidator = require("../middlewares/validator/users/index");
const { readUsers, readUserById, createUser, editUserById, deleteUserById } =
  usersController;
const auth = require("../middlewares/auth/auth");
const ClientError = require("../exceptions/ClientError");
const response = require("../helper/response");
const upload = require("../middlewares/files/upload");
const uploadHandler = upload.imageUploadUser.single("photo");

Router.get("/", auth.checkToken, auth.checkRole, readUsers);
Router.get("/profile", auth.checkToken, readUserById);
Router.post(
  "/",
  auth.checkToken,
  auth.checkRole,
  usersValidator.usersValidatorPost.validator,
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
  createUser
);
Router.patch(
  "/",
  auth.checkToken,
  usersValidator.usersValidatorPatch.validator,
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
  editUserById
);
Router.delete("/:id", auth.checkToken, auth.checkRole, deleteUserById);

module.exports = Router;
