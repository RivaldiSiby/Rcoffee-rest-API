const multer = require("multer");
const path = require("path");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

const imgstorageUser = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img/users");
  },
  filename: (req, file, cb) => {
    const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `users-${suffix}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});
const imgstorageProduct = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img/products");
  },
  filename: (req, file, cb) => {
    const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `products-${suffix}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});
const imgstoragePromo = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img/promos");
  },
  filename: (req, file, cb) => {
    const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `promos-${suffix}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

const limit = {
  fileSize: 2e6,
};

const imageOnlyFilter = (req, file, cb) => {
  const extName = path.extname(file.originalname).toLowerCase();
  const allowedExt = /jpg|png/;
  if (!allowedExt.test(extName)) {
    return cb(
      new NotFoundError("Only Use Allowed Extension (JPG, PNG)"),
      false
    );
  }

  cb(null, true);
};

const imageUploadUser = multer({
  storage: imgstorageUser,
  limits: limit,
  fileFilter: imageOnlyFilter,
});
const imageUploadProduct = multer({
  storage: imgstorageProduct,
  limits: limit,
  fileFilter: imageOnlyFilter,
});
const imageUploadPromo = multer({
  storage: imgstoragePromo,
  limits: limit,
  fileFilter: imageOnlyFilter,
});

module.exports = {
  imageUploadProduct,
  imageUploadUser,
  imageUploadPromo,
};
