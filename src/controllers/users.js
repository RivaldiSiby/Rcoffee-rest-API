const users = require("../models/users");
const response = require("../helper/response");
const ClientError = require("../exceptions/ClientError");
const usersValidator = require("../middlewares/validator/users/index");

const readUsers = async (req, res) => {
  const result = await users.getUsers();
  return response.isSuccessHaveData(
    res,
    200,
    result.rows,
    "Read Data has been success"
  );
};

const readUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await users.getUserById(id);

    return response.isSuccessHaveData(
      res,
      201,
      result,
      "Read Single Data has been success"
    );
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

const createUser = async (req, res) => {
  try {
    usersValidator.validator(req.body);
    const result = await users.postUser(req.body);
    return response.isSuccessHaveData(
      res,
      201,
      { id: result },
      "Create Data has been success"
    );
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

const editUserById = async (req, res) => {
  try {
    usersValidator.validator(req.body);
    const { id } = req.params;
    await users.putUserById(id, req.body);
    return response.isSuccessNoData(res, 200, "Update Data has been success");
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

const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    await users.deleteUserById(id);
    return response.isSuccessNoData(res, 200, "Delete Data has been Success");
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

module.exports = {
  readUsers,
  readUserById,
  createUser,
  editUserById,
  deleteUserById,
};
