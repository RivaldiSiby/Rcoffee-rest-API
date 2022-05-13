const jwt = require("jsonwebtoken");
const AuthError = require("../../exceptions/authError");
const ClientError = require("../../exceptions/ClientError");
const ForbiddenError = require("../../exceptions/ForbiddenError");
const InvariantError = require("../../exceptions/InvariantError");
const response = require("../../helper/response");
const auth = require("../../models/auth");

const checkDuplicate = async (req, res, next) => {
  try {
    await auth.verifyByEmail(req.body.email);
    next();
  } catch (error) {
    return response.isError(res, error.statusCode, error.message);
  }
};

const checkToken = async (req, res, next) => {
  try {
    const bToken = req.header("Authorization");
    if (!bToken) {
      throw new AuthError("Sign in needed");
    }
    const token = bToken.split(" ")[1];
    // verify token
    await jwt.verify(token, process.env.JWT_SECRET, {
      issuer: process.env.JWT_ISSUER,
    });

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return response.isError(res, 401, "Sign in needed");
    }
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
const checkUserId = async (req, res, next) => {
  try {
    const bToken = req.header("Authorization");
    const token = bToken.split(" ")[1];
    const decode = await jwt.decode(token);

    // cek otorisasi
    if (decode.role !== "admin") {
      if (decode.id !== req.params.id || decode.id !== req.body.user_id) {
        throw new ForbiddenError("resources cannot be accessed");
      }
    }
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return response.isError(res, 401, "Sign in needed");
    }
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
const checkRole = async (req, res, next) => {
  try {
    const bToken = req.header("Authorization");
    const token = bToken.split(" ")[1];
    const decode = await jwt.decode(token);

    // cek otorisasi
    if (decode.role !== "admin") {
      throw new ForbiddenError("resources cannot be accessed");
    }
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return response.isError(res, 401, "Sign in needed");
    }
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

module.exports = { checkDuplicate, checkToken, checkRole, checkUserId };
