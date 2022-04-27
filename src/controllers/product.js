const ClientError = require("../exceptions/ClientError");
const response = require("../helper/response");
const product = require("../models/product");

const readProducts = async (req, res) => {
  try {
    const { query } = req;
    const sort = Object.keys(query).find((item) => item === "sort");
    const order = Object.keys(query).find((item) => item === "order");
    const byCategory = Object.keys(query).find((item) => item === "category");
    const byName = Object.keys(query).find((item) => item === "name");
    if (byName !== undefined) {
      const result = await product.getProductByName(query.name);
      return response.isSuccessHaveData(
        res,
        200,
        result,
        "Read Data By Name has been success"
      );
    }
    if (byCategory !== undefined) {
      const result = await product.getProductsByCategory(query.category);
      return response.isSuccessHaveData(
        res,
        200,
        result,
        "Read All Data By Category has been success"
      );
    }
    if (sort !== undefined && order !== undefined) {
      let keysort = query.sort.toLowerCase() === "harga" ? "price_unit" : "";
      keysort = query.sort.toLowerCase() === "waktu" ? "created_at" : keysort;
      const result = await product.getProductsAll(keysort, query.order);
      return response.isSuccessHaveData(
        res,
        200,
        result,
        "Read Data has been success"
      );
    }
    const result = await product.getProductsAll();
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
    const result = await product.getProductById(id);
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
