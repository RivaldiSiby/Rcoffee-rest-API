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
const checkRefresh = async (refreshToken) => {
  try {
    // cek token dari database
    await auth.verifyRefreshToken(refreshToken);
    let keyToken = refreshToken;
    // verify token
    const user = await jwt.verify(keyToken, process.env.JWT_REFRESH_SECRET, {
      issuer: process.env.JWT_ISSUER,
    });
    // generate jwt
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    // generate access token
    const jwtOptionsToken = {
      issuer: process.env.JWT_ISSUER,
      expiresIn: "60s", // expired in 60s
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, jwtOptionsToken);

    return token;
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      throw error;
    }
    if (error instanceof ClientError) {
      // console.log(error.statusCode);
      throw error;
      // return response.isError(res, 400, error.message);
    }
    console.log(error);
    throw error;
  }
};

const checkToken = async (req, res, next) => {
  try {
    const bToken = req.header("Authorization");
    if (!bToken) {
      throw new AuthError("Sign in needed");
    }

    const token = bToken.toString().split(" ")[1];
    // verify token
    await jwt.verify(token, process.env.JWT_SECRET, {
      issuer: process.env.JWT_ISSUER,
    });

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const refreshToken = req.params.refresh;

      // cek refresh token
      if (refreshToken !== undefined) {
        const data = await checkRefresh(refreshToken)
          .then((data) => {
            return data;
          })
          .catch((err) => err);
        if (data.length > 0) {
          return response.isSuccessHaveData(
            res,
            200,
            { accessToken: data },
            "token generate"
          );
        }
      }
      return response.isError(res, 401, "Sign in needed");
    }
    if (error.name === "JsonWebTokenError" || error.name === "NotBeforeError") {
      return response.isError(res, 401, "Sign in needed");
    }
    if (error instanceof ClientError) {
      return response.isError(res, error.statusCode, error.message);
    }
    console.log(error);
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
