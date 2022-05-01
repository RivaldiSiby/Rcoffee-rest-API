const InvariantError = require("../../../exceptions/InvariantError");
const response = require("../../../helper/response");
const { rulesPost, rulesPatch } = require("./rules");
const productValidatorPost = {
  validator: (req, res, next) => {
    const result = rulesPost.validate(req.body);
    if (result.error) {
      return response.isError(res, 400, result.error.message);
    }
    next();
  },
};
const productValidatorPatch = {
  validator: (req, res, next) => {
    const result = rulesPatch.validate(req.body);
    if (result.error) {
      return response.isError(res, 400, result.error.message);
    }
    next();
  },
};
module.exports = { productValidatorPost, productValidatorPatch };
