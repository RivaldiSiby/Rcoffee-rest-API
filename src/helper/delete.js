const fs = require("fs");
const InvariantError = require("../exceptions/InvariantError");

const deleteFiles = {};

deleteFiles.imgFiles = (img) => {
  const path = img;

  fs.unlink(path, (error) => {
    if (error) {
      throw new InvariantError("Delete File has been Failed");
    }
  });
};

module.exports = deleteFiles;
