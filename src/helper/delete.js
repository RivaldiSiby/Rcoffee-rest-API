const fs = require("fs");

const deleteFiles = {};

deleteFiles.imgFiles = (img) => {
  const path = img;

  fs.unlink(path, (error) => {
    if (error) throw new Error("Delete File has been Failed");
  });
};

module.exports = deleteFiles;
