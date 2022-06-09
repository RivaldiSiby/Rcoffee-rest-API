const ClientError = require("../exceptions/ClientError");
const auth = require("../models/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const InvariantError = require("../exceptions/InvariantError");
const response = require("../helper/response");

const register = async (req, res) => {
  try {
    const result = await auth.registerUser(req.body);
    return response.isSuccessHaveData(
      res,
      201,
      { id: result },
      "Register Success"
    );
  } catch (error) {
    console.log(error);
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
const logOut = async (req, res) => {
  try {
    await auth.deleteRefreshToken(req.params.refresh);
    response.isSuccessNoData(res, 200, "Logout Success");
  } catch (error) {
    console.log(error);
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

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const datauser = await auth.verifyUserByEmail(email);
    const cekpass = await bcrypt.compare(password, datauser.password);

    if (!cekpass) {
      throw new InvariantError("Email is not registered Or Password is Wrong");
    }
    // cek gambar
    const imgName =
      datauser.img !== null ? datauser.img : "/img/users/usericon.png";
    // generate jwt
    const payload = {
      id: datauser.id,
      email,
      role: datauser.role,
    };

    const jwtOptionsToken = {
      issuer: process.env.JWT_ISSUER,
      expiresIn: "15s", // expired in 15s
    };
    const jwtOptionsRefreshToken = {
      issuer: process.env.JWT_ISSUER,
      expiresIn: "1d", // expired in 1d
    };
    const token = await jwt.sign(
      payload,
      process.env.JWT_SECRET,
      jwtOptionsToken
    );
    const refreshToken = await jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET,
      jwtOptionsRefreshToken
    );
    // push ke database refresh tokenya
    await auth.postToken(refreshToken);

    return response.isSuccessHaveData(
      res,
      200,
      { email, img: imgName, token, refreshToken },
      "Sign In Success"
    );
  } catch (error) {
    if (error instanceof ClientError) {
      return response.isError(res, error.statusCode, error.message);
    }
    //   error server
    console.log(error);
    return response.isError(
      res,
      500,
      "Sorry, there was a failure on our server"
    );
  }
};

module.exports = { signIn, register, logOut };
