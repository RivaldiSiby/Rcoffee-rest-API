const ClientError = require("../exceptions/ClientError");
const response = require("../helper/response");
const product = require("../models/product");
const stock = require("../models/stock");
const deleteFiles = require("../helper/delete");

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
    const { file = null } = req;
    const filename = file !== null ? file.path : null;
    const body = { ...req.body, img: filename };
    const result = await product.postProduct(body);
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
    const { file = null } = req;
    const { id } = req.params;
    let data = await product.getProductById(id);
    // atur data patch
    // hapus gambar
    if (file !== null && data[0].img !== null) {
      await deleteFiles.imgFiles(data[0].img);
    }
    data[0].img = file !== null ? file.path : data[0].img;
    data[0].name = req.body.name !== undefined ? req.body.name : data[0].name;
    data[0].description =
      req.body.description !== undefined
        ? req.body.description
        : data[0].description;
    data[0].category =
      req.body.category !== undefined ? req.body.category : data[0].category;
    data[0].img = req.body.img !== undefined ? req.body.img : data[0].img;
    await product.patchProduct(id, data[0]);

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
    await stock.deleteStockByProduct(id);
    const img = await product.deleteProductById(id);
    console.log(img);
    if (img !== null) {
      await deleteFiles.imgFiles(img);
    }
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
