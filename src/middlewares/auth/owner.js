const response = require("../../helper/response");
const bcrypt = require("bcrypt");
const ForbiddenError = require("../../exceptions/ForbiddenError");
const ClientError = require("../../exceptions/ClientError");

const checkOwnerCode = async (req, res, next) => {
  try {
    const { code = null } = req.query;
    if (code === null) {
      throw new ForbiddenError("resources cannot be accessed");
    }
    const cekPass = await bcrypt.compare(code, process.env.OWNER_CODE_HASH);
    if (!cekPass) {
      throw new ForbiddenError("resources cannot be accessed. Code not valid");
    }
    next();
  } catch (error) {
    if (error instanceof ClientError) {
      return response.isError(res, error.statusCode, error.message);
    }
    return response.isError(
      res,
      500,
      "Sorry, there was a failure on our server"
    );
  }
};

module.exports = { checkOwnerCode };
