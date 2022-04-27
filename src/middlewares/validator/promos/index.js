const InvariantError = require("../../../exceptions/InvariantError");
const { rules } = require("./rules");
const promosValidator = {
  validator: (req, res, next) => {
    const result = rules.validate(req.body);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
    next();
  },
};
module.exports = promosValidator;
