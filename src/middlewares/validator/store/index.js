const InvariantError = require("../../../exceptions/InvariantError");
const { rules } = require("./rules");
const storeValidator = {
  validator: (body) => {
    const result = rules.validate(body);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};
module.exports = storeValidator;
