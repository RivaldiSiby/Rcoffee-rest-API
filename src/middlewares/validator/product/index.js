const InvariantError = require("../../../exceptions/InvariantError");
const { rulesBody } = require("./rules");
const productValidatorBody = {
  validator: (req, res) => {
    const result = rulesBody.validate(req.body);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};
module.exports = { productValidatorBody };
