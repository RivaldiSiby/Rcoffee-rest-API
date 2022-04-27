const InvariantError = require("../../../exceptions/InvariantError");
const { rules } = require("./rules");

const usersValidator = {
  validator: (req, res) => {
    const result = rules.validate(req.body);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = usersValidator;
