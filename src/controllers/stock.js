const ClientError = require("../exceptions/ClientError");
const response = require("../helper/response");
const stock = require("../models/stock");
const product = require("../models/product");

const readStocks = async (req, res) => {
  try {
    const result = await stock.getStocksAll();
    return response.isSuccessHaveData(
      res,
      200,
      result.rows,
      "Read All Data has been success"
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
const readStockById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await stock.getStockById(id);
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
const createdNewStock = async (req, res) => {
  try {
    await product.getProductById(req.body.product_id);
    const result = await stock.postStock(req.body);
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

const editStockById = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const isAddQuantity = Object.keys(body).find(
      (item) => item === "add_quantity"
    );

    if (isAddQuantity !== undefined) {
      const result = await stock.getStockById(id);
      const quantity = parseInt(result.quantity) + parseInt(body.add_quantity);
      await stock.putStockQuantity(id, quantity);
      return response.isSuccessNoData(
        res,
        200,
        "Add Data Quantity has been success"
      );
    }
    stockValidator.validatorPut(req.body);
    await stock.putStock(id, req.body);
    return response.isSuccessNoData(res, 200, "Update Data has been success");
  } catch (error) {
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

const deleteStockById = async (req, res) => {
  try {
    const { id } = req.params;
    await stock.deleteStockById(id);
    return response.isSuccessNoData(res, 200, "Delete Data has been success");
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
  readStockById,
  readStocks,
  createdNewStock,
  editStockById,
  deleteStockById,
};
