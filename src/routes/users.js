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
const multer = require("multer");
const uploadHandler = upload.imageUploadUser.single("photo");

Router.get("/", auth.checkToken, auth.checkRole, readUsers);
Router.get("/profile", auth.checkToken, readUserById);
Router.post(
  "/",
  auth.checkToken,
  auth.checkRole,
  function (req, res, next) {
    uploadHandler(req, res, function (err) {
      if (err) {
        console.log(err.message);
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          return response.isError(res, 400, err.message);
        }
        if (err instanceof ClientError) {
          return response.isError(res, err.statusCode, err.message);
        }
        if (err) {
          return response.isError(
            res,
            500,
            "Sorry, there was a failure on our server"
          );
        }
      }

      next();
    });
  },
  usersValidator.usersValidatorPost.validator,
  createUser
);
Router.patch(
  "/",
  auth.checkToken,
  function (req, res, next) {
    uploadHandler(req, res, function (err) {
      if (err) {
        console.log(err.message);
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          return response.isError(res, 400, err.message);
        }
        if (err instanceof ClientError) {
          return response.isError(res, err.statusCode, err.message);
        }
        if (err) {
          return response.isError(
            res,
            500,
            "Sorry, there was a failure on our server"
          );
        }
      }

      next();
    });
  },

  usersValidator.usersValidatorPatch.validator,
  editUserById
);
Router.delete("/:id", auth.checkToken, auth.checkRole, deleteUserById);

module.exports = Router;
