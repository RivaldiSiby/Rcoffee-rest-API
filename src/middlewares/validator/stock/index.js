const InvariantError = require("../../../exceptions/InvariantError");
const { rulesPost, rulesPut } = require("./rules");
const stockValidator = {
  validatorPost: (body) => {
    const result = rulesPost.validate(body);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
  validatorPut: (body) => {
    const result = rulesPut.validate(body);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};
module.exports = stockValidator;
