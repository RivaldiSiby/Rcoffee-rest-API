const ClientError = require("../exceptions/ClientError");
const response = require("../helper/response");
const stock = require("../models/stock");
const product = require("../models/product");

const readStocks = async (req, res) => {
  try {
    req.query.page = req.query.page === undefined ? 1 : req.query.page;
    const result = await stock.getStocksAll(req.query);
    const { totalData, totalPage, data } = result;

    const nextPage = parseInt(req.query.page) + 1;
    const prevPage = parseInt(req.query.page) - 1;
    // path query
    let queryPath = "";
    queryPath +=
      req.query.limit !== undefined ? `limit=${req.query.limit}&` : "";
    // path query
    let next =
      nextPage > totalPage
        ? {}
        : { next: `/stock?${queryPath}page=${nextPage}` };
    let prev =
      req.query.page <= 1
        ? {}
        : { prev: `/stock?${queryPath}page=${prevPage}` };
    const meta = {
      totalData: totalData,
      totalPage: totalPage,
      page: req.query.page,
      ...next,
      ...prev,
    };
    return response.isSuccessHaveData(
      res,
      200,
      data,
      meta,
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
    console.log(error);
    return response.isError(
      res,
      500,
      "Sorry, there was a failure on our server"
    );
  }
};
const createdNewStock = async (req, res) => {
  try {
    await product.getJustProductById(req.body.product_id);
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
      const quantity = result.quantity + parseInt(body.add_quantity);
      await stock.patchStockQuantity(id, quantity);
      return response.isSuccessNoData(
        res,
        200,
        "Add Data Quantity has been success"
      );
    }
    let data = await stock.getStockById(id);
    // atur data patch
    data.size = req.body.size !== undefined ? req.body.size : data.size;
    data.quantity =
      req.body.quantity !== undefined ? req.body.quantity : data.quantity;
    data.price = req.body.price !== undefined ? req.body.price : data.price;
    data.product_id =
      req.body.product_id !== undefined ? req.body.product_id : data.product_id;
    await stock.patchStock(id, data);
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
