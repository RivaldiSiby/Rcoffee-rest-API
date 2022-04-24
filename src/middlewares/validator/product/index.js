const InvariantError = require("../../../exceptions/InvariantError");
const { rulesBody } = require("./rules");
const productValidatorBody = {
  validator: (body) => {
    const result = rulesBody.validate(body);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};
module.exports = { productValidatorBody };
