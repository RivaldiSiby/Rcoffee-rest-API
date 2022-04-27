const InvariantError = require("../../../exceptions/InvariantError");
const response = require("../../../helper/response");
const { rules } = require("./rules");
const promosValidator = {
  validator: (req, res, next) => {
    const result = rules.validate(req.body);
    if (result.error) {
      return response.isError(res, 400, result.error.message);
    }
    next();
  },
};
module.exports = promosValidator;
