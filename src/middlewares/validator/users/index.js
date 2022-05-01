const InvariantError = require("../../../exceptions/InvariantError");
const response = require("../../../helper/response");
const { rulesPost, rulesPatch } = require("./rules");

const usersValidatorPost = {
  validator: (req, res, next) => {
    const result = rulesPost.validate(req.body);
    if (result.error) {
      return response.isError(res, 400, result.error.message);
    }
    next();
  },
};
const usersValidatorPatch = {
  validator: (req, res, next) => {
    const result = rulesPatch.validate(req.body);
    if (result.error) {
      return response.isError(res, 400, result.error.message);
    }
    next();
  },
};

module.exports = { usersValidatorPost, usersValidatorPatch };
