const role = require("../models/role");
const response = require("../helper/response");
const ClientError = require("../exceptions/ClientError");

const readRole = async (req, res) => {
  try {
    const result = await role.getRole();
    return response.isSuccessHaveData(
      res,
      200,
      result,
      "Read Data has been success"
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
const readRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await role.getRole(id);
    return response.isSuccessHaveData(
      res,
      200,
      result,
      "Read Data has been success"
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

const creatRole = async (req, res) => {
  try {
    const result = await role.postRole(req.body);
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

const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    await role.deleteRoleById(id);
    return response.isSuccessNoData(res, 200, "Delete Data has been Success");
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

module.exports = { readRole, readRoleById, creatRole, deleteRole };
