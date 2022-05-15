const express = require("express");

const Router = express.Router();
const multer = require("multer");
const ClientError = require("../exceptions/ClientError");
const response = require("../helper/response");
const upload = require("../middlewares/files/upload");
const uploadHandler = upload.imageUploadUser.single("photo");
Router.post(
  "/",
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
  (req, res) => {
    const { file = null } = req;
    console.log(file.filename, req.body);
    res.status(200).json(file);
  }
);

module.exports = Router;
