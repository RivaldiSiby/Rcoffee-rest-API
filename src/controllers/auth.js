const ClientError = require("../exceptions/ClientError");
const auth = require("../models/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const InvariantError = require("../exceptions/InvariantError");
const response = require("../helper/response");

const register = async (req, res) => {
  try {
    const { file = null } = req;
    const filename = file !== null ? file.path : null;
    console.log(file);
    const body = { ...req.body, img: filename };
    const result = await auth.registerUser(body);
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

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const datauser = await auth.verifyUserByEmail(email);
    const cekpass = await bcrypt.compare(password, datauser.password);

    if (!cekpass) {
      throw new InvariantError("Password is Wrong");
    }
    // generate jwt
    const payload = {
      id: datauser.id,
      email,
      role: datauser.role,
    };

    const jwtOptions = {
      issuer: process.env.JWT_ISSUER,
      expiresIn: "1000s", // expired in 1000s
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, jwtOptions);
    return response.isSuccessHaveData(
      res,
      200,
      { email, token },
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

module.exports = { signIn, register };
