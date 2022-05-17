const InvariantError = require("../../../exceptions/InvariantError");
const response = require("../../../helper/response");
const { rulesPost, rulesPatch } = require("./rules");
const deleteFiles = require("../../../helper/delete");
const productValidatorPost = {
  validator: (req, res, next) => {
    const result = rulesPost.validate(req.body);
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
const productValidatorPatch = {
  validator: (req, res, next) => {
    const result = rulesPatch.validate(req.body);
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
module.exports = { productValidatorPost, productValidatorPatch };
