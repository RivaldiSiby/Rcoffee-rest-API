const express = require("express");

const Router = express.Router();
const multer = require("multer");
const ClientError = require("../exceptions/ClientError");
const InvariantError = require("../exceptions/InvariantError");
const response = require("../helper/response");
const upload = require("../middlewares/files/upload");
const uploadHandler = upload.imageUploadUser.single("photo");
Router.post(
  "/",
  function (req, res) {
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
  async (req, res) => {
    try {
      // const { file = null } = req;
      // console.log(file.error.message);
      res.status(200).json("tes");
    } catch (error) {
      // console.log(error.message);
    }
  }
);

module.exports = Router;
