const ClientError = require("../exceptions/ClientError");
const response = require("../helper/response");
const promos = require("../models/promos");
const product = require("../models/product");

const readPromosAll = async (req, res) => {
  try {
    req.query.page = req.query.page === undefined ? 1 : req.query.page;
    const result = await promos.getPromosAll(req.query);
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
        : { next: `/promos?${queryPath}page=${nextPage}` };
    let prev =
      req.query.page <= 1
        ? {}
        : { prev: `/promos?${queryPath}page=${prevPage}` };
    const meta = {
      totalData: totalData,
      totalPage: totalPage,
      page: req.query.page,
      ...next,
      ...prev,
    };
    return response.isSuccessHaveAllData(
      res,
      200,
      data,
      meta,
      "Read Data has been success"
    );
  } catch (error) {
    console.log(error);
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
    await product.getJustProductById(req.body.product_id);
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
    let data = await promos.getPromosById(id);
    // atur data patch
    data.discount =
      req.body.discount !== undefined ? req.body.discount : data.discount;
    data.description =
      req.body.description !== undefined
        ? req.body.description
        : data.description;
    data.coupon = req.body.coupon !== undefined ? req.body.coupon : data.coupon;
    data.product_id =
      req.body.product_id !== undefined ? req.body.product_id : data.product_id;
    await promos.patchPromosById(id, data);
    return response.isSuccessNoData(res, 200, "Update Data has been success");
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
