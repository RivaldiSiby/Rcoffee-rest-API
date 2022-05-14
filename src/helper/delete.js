const fs = require("fs");

const deleteFiles = {};

deleteFiles.imgUsers = (img) => {
  const path = `public/img/users/${img}`;

  fs.unlink(path, (error) => {
    if (error) throw new Error("Delete File has been Failed");
  });
};
deleteFiles.imgProducts = (img) => {
  const path = `public/img/products/${img}`;

  fs.unlink(path, (error) => {
    if (error) throw new Error("Delete File has been Failed");
  });
};

module.exports = deleteFiles;
