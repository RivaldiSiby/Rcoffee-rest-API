const InvariantError = require("../../../exceptions/InvariantError");
const response = require("../../../helper/response");
const { rulesPost, rulesPut } = require("./rules");
const promosValidatorPost = {
  validator: (req, res, next) => {
    const result = rulesPost.validate(req.body);
    if (result.error) {
      return response.isError(res, 400, result.error.message);
    }
    next();
  },
};
const promosValidatorPut = {
  validator: (req, res, next) => {
    const result = rulesPut.validate(req.body);
    if (result.error) {
      return response.isError(res, 400, result.error.message);
    }
    next();
  },
};
module.exports = { promosValidatorPost, promosValidatorPut };
