const ClientError = require("../exceptions/ClientError");
const response = require("../helper/response");
const product = require("../models/product");
const stock = require("../models/stock");

const readProducts = async (req, res) => {
  try {
    const result = await product.getProducts(req);
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
    //   error server
    console.log(error);
    return response.isError(
      res,
      500,
      "Sorry, there was a failure on our server"
    );
  }
};

const readProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let result = await product.getProductById(id);
    if (!result.length) {
      result = await product.getJustProductById(id);
    }
    return response.isSuccessHaveData(
      res,
      200,
      result,
      "Read Data By Id has been success"
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

const createProduct = async (req, res) => {
  try {
    const result = await product.postProduct(req.body);
    return response.isSuccessHaveData(
      res,
      201,
      result,
      "Create Data has been success"
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

const editProductById = async (req, res) => {
  try {
    const { id } = req.params;
    await product.putProduct(id, req.body);
    return response.isSuccessNoData(res, 200, "Update Data has been success");
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

const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    await product.deleteProductById(id);
    await stock.deleteStockByProduct(id);
    return response.isSuccessNoData(res, 200, "Delete Data has been success");
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
  readProducts,
  readProductById,
  createProduct,
  editProductById,
  deleteProductById,
};
