const InvariantError = require("../../../exceptions/InvariantError");
const response = require("../../../helper/response");
const { rulesPost, rulesPatch } = require("./rules");
const stockValidator = {
  validatorPost: (req, res, next) => {
    const result = rulesPost.validate(req.body);
    if (result.error) {
      return response.isError(res, 400, result.error.message);
    }
    next();
  },
  validatorPatch: (req, res, next) => {
    const result = rulesPatch.validate(req.body);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
    next();
  },
};
module.exports = stockValidator;
