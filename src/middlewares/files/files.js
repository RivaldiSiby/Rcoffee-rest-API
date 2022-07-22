const upload = require("./upload");
const multer = require("multer");
const uploadHandlerUser = upload.imageUploadUser.single("photo");
const uploadHandlerProduct = upload.imageUploadProduct.single("photo");
const uploadHandlerPromo = upload.imageUploadPromo.single("photo");
const ClientError = require("../../exceptions/ClientError");
const response = require("../../helper/response");
const path = require("path");
// option multer
const limit = {
  fileSize: 2e6,
};

const imageOnlyFilter = (req, file, cb) => {
  console.log(file);
  const extName = path.extname(file.originalname).toLowerCase();
  const allowedExt = /jpg|png/;
  console.log(file);
  if (!allowedExt.test(extName)) {
    return cb(
      new NotFoundError("Only Use Allowed Extension (JPG, PNG)"),
      false
    );
  }

  cb(null, true);
};
// multer
const handlerUpload = multer({
  storage: multer.diskStorage({}),
  limits: limit,
  fileFilter: imageOnlyFilter,
});

const fileUpload = handlerUpload.single("photo");
function uploadUser(req, res, next) {
  if (process.env.STATUS === "development") {
    uploadHandlerUser(req, res, function (err) {
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
  } else {
    fileUpload(req, res, function (err) {
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
  }
}
function uploadProduct(req, res, next) {
  if (process.env.STATUS === "development") {
    uploadHandlerProduct(req, res, function (err) {
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
  } else {
    fileUpload(req, res, function (err) {
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
  }
}
function uploadPromo(req, res, next) {
  if (process.env.STATUS === "development") {
    uploadHandlerPromo(req, res, function (err) {
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
  } else {
    fileUpload(req, res, function (err) {
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
  }
}

module.exports = { uploadUser, uploadPromo, uploadProduct };
