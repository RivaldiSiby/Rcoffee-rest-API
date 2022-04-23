const store = require("../models/store");
const response = require("../helper/response");
const ClientError = require("../exceptions/ClientError");
const storeValidator = require("../middlewares/validator/store/index");

const readStore = async (req, res) => {
  const result = await store.getStore();
  return response.isSuccessHaveData(
    res,
    200,
    result.rows,
    "Read Data Store has been success"
  );
};
const readStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await store.getStoreById(id);
    return response.isSuccessHaveData(
      res,
      200,
      result,
      "Read Single Data Store has been success"
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

const createStore = async (req, res) => {
  try {
    // check validasi
    storeValidator.validator(req.body);
    const result = await store.postStore(req.body);
    return response.isSuccessHaveData(
      res,
      201,
      { id: result },
      "Create Data Store has been success"
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

const editStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    storeValidator.validator(req.body);
    await store.putStoreById(id, req.body);
    return response.isSuccessNoData(
      res,
      200,
      "Edit Data Store has been success"
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

const deleteStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    await store.deleteStoreById(id);
    return response.isSuccessNoData(
      res,
      200,
      "Delete Data Store has been success"
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
  readStore,
  readStoreById,
  createStore,
  editStoreById,
  deleteStoreById,
};
