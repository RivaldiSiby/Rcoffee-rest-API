const jwt = require("jsonwebtoken");
const AuthError = require("../exceptions/authError");

const decodeToken = async (header) => {
  try {
    const token = header.split(" ")[1];
    const decode = await jwt.decode(token);

    return decode;
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      throw new AuthError("Sign in needed");
    }
  }
};

module.exports = { decodeToken };
