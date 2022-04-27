const ClientError = require("../exceptions/ClientError");
const response = require("../helper/response");
const promos = require("../models/promos");

const readPromosAll = async (req, res) => {
  try {
    const result = await promos.getPromosAll();
    return response.isSuccessHaveData(
      res,
      200,
      result.rows,
      "Read Data has been success"
    );
  } catch (error) {
    if (error instanceof ClientError) {
      return response.isError(res, error.statusCode, error.message);
    }
    // server error
    return response.isError(
      res,
      500,
      "Sorry, there was a failure on our server"
    );
  }
};

const readPromosById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await promos.getPromosById(id);
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
    // server error
    return response.isError(
      res,
      500,
      "Sorry, there was a failure on our server"
    );
  }
};

const createPromos = async (req, res) => {
  try {
    const result = await promos.postPromos(req.body);
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
    // server error
    console.log(error);
    return response.isError(
      res,
      500,
      "Sorry, there was a failure on our server"
    );
  }
};
const editPromosById = async (req, res) => {
  try {
    const { id } = req.params;

    await promos.putPromosById(id, req.body);
    return response.isSuccessNoData(res, 200, "Update Data has been success");
  } catch (error) {
    if (error instanceof ClientError) {
      return response.isError(res, error.statusCode, error.message);
    }
    // server error
    return response.isError(
      res,
      500,
      "Sorry, there was a failure on our server"
    );
  }
};

const deletePromosById = async (req, res) => {
  try {
    const { id } = req.params;
    await promos.deletePromosById(id);
    return response.isSuccessNoData(res, 200, "Delete Data has been success");
  } catch (error) {
    if (error instanceof ClientError) {
      return response.isError(res, error.statusCode, error.message);
    }
    // server error
    return response.isError(
      res,
      500,
      "Sorry, there was a failure on our server"
    );
  }
};

module.exports = {
  readPromosAll,
  readPromosById,
  createPromos,
  editPromosById,
  deletePromosById,
};
