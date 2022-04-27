const InvariantError = require("../../../exceptions/InvariantError");
const response = require("../../../helper/response");
const { rulesPost, rulesPut } = require("./rules");
const stockValidator = {
  validatorPost: (req, res, next) => {
    const result = rulesPost.validate(req.body);
    if (result.error) {
      return response.isError(res, 400, result.error.message);
    }
    next();
  },
  validatorPut: (req, res) => {
    const result = rulesPut.validate(req.body);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
    next();
  },
};
module.exports = stockValidator;
