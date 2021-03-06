const InvariantError = require("../../../exceptions/InvariantError");
const response = require("../../../helper/response");
const { rulesRegis, rulesSignIn } = require("./rules");
const deleteFiles = require("../../../helper/delete");
const authValidatorRegis = {
  validator: (req, res, next) => {
    const result = rulesRegis.validate(req.body);
    if (result.error) {
      const { file = null } = req;
      if (file !== null) {
        deleteFiles.imgFiles(file.path);
      }
      return response.isError(res, 400, result.error.message);
    }
    next();
  },
};
const authValidatorSignIn = {
  validator: (req, res, next) => {
    const result = rulesSignIn.validate(req.body);
    if (result.error) {
      return response.isError(res, 400, result.error.message);
    }
    next();
  },
};

module.exports = { authValidatorRegis, authValidatorSignIn };
