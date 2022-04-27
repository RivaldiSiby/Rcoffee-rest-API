const InvariantError = require("../../../exceptions/InvariantError");
const response = require("../../../helper/response");
const { rulesBody } = require("./rules");
const transactionValidator = {
  validator: (req, res, next) => {
    const result = rulesBody.validate(req.body);
    if (result.error) {
      return response.isError(res, 400, result.error.message);
    }

    next();
  },
};
module.exports = transactionValidator;
