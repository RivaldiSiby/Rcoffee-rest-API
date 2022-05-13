const users = require("../models/users");
const response = require("../helper/response");
const ClientError = require("../exceptions/ClientError");
const decode = require("../helper/docedeToken");

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
    const payload = await decode.decodeToken(req.header("Authorization"));

    const id = payload.id;
    const result = await users.getUserById(id);

    return response.isSuccessHaveData(
      res,
      200,
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
    const payload = await decode.decodeToken(req.header("Authorization"));

    const id = payload.id;
    let data = await users.getUserByIdAllData(id);
    // atur data patch
    data[0].name = req.body.name !== undefined ? req.body.name : data[0].name;
    data[0].email =
      req.body.email !== undefined ? req.body.email : data[0].email;
    data[0].password =
      req.body.password !== undefined ? req.body.password : data[0].password;
    data[0].phone =
      req.body.phone !== undefined ? req.body.phone : data[0].phone;
    data[0].date_birth =
      req.body.date_birth !== undefined
        ? req.body.date_birth
        : data[0].date_birth;
    data[0].gender =
      req.body.gender !== undefined ? req.body.gender : data[0].gender;
    data[0].address =
      req.body.address !== undefined ? req.body.address : data[0].address;
    data[0].role = req.body.role !== undefined ? req.body.role : data[0].role;
    await users.patchUserById(id, data[0]);
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
