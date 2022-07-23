const ClientError = require("../exceptions/ClientError");
const auth = require("../models/auth");
const mail = require("../models/mail");
const users = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const InvariantError = require("../exceptions/InvariantError");
const response = require("../helper/response");
const {
  sendConfirmationEmail,
  sendPasswordConfirmation,
} = require("../config/nodemailer");

const register = async (req, res) => {
  try {
    const code = Math.floor(Math.random() * 899999 + 100000);
    const result = await auth.registerUser(req.body);
    const destination = result;
    const purpose = "confirm_account";
    // set expirre
    const expire = null;
    // post mail
    await mail.postMail({ destination, purpose, expire, code });
    await sendConfirmationEmail(result, code);
    return response.isSuccessHaveData(
      res,
      201,
      { id: result },
      "Register Success,Please Check email for verification"
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
const checkConfirmEmail = async (req, res) => {
  try {
    const result = await mail.getMail(req.body.email);
    // cek validasi code
    if (result.code !== req.body.code) {
      throw new InvariantError("wrong code");
    }
    await mail.verifyEmail(req.body.email);
    await mail.deleteMail(req.body.email);
    return response.isSuccessHaveData(
      res,
      200,
      { code: result.code },
      "Your Email has been verified"
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
const resetPassword = async (req, res) => {
  try {
    await mail.resetPass(req.body.email, req.body.code, req.body.password);
    // cek validasi code

    return response.isSuccessNoData(res, 200, "Password has been updated");
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
const checkConfirmPassword = async (req, res) => {
  try {
    const result = await mail.getMail(req.body.email);
    // cek validasi code
    if (result.code !== req.body.code) {
      throw new InvariantError("wrong code");
    }
    // cek expire code
    const now = new Date().getTime();
    if (result.expire < now) {
      throw new InvariantError("code has expired");
    }
    return response.isSuccessHaveData(
      res,
      201,
      { code: result.code, email: result.destination },
      "Confirm code is success"
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
const forgotPassword = async (req, res) => {
  try {
    // cek apakah email ada
    const emailCek = await auth.verifyUserByEmail(req.body.email);
    if (!emailCek.rows.length) {
      throw new InvariantError("Email is not registered ");
    }
    const code = Math.floor(Math.random() * 899999 + 100000);
    const destination = req.body.email;
    const purpose = "Forgot_Password";
    // set expirre
    const now = new Date().getTime();
    // expire 10 menit
    const expire = now + 10 * 60 * 1000;
    // post mail
    await mail.deleteMail(req.body.email);
    await mail.postMail({ destination, purpose, expire, code });
    await sendPasswordConfirmation(req.body.email, code);
    return response.isSuccessNoData(
      res,
      200,
      "Please check your email for password confirmation"
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
    const user = await users.getUserById(datauser.id);
    const imgName = user.img !== "" ? user.img : false;
    console.log(user.img);
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
      { datauser: user, img: imgName, token, refreshToken },
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

module.exports = {
  forgotPassword,
  signIn,
  register,
  logOut,
  checkConfirmEmail,
  checkConfirmPassword,
  resetPassword,
};
