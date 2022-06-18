const ClientError = require("../exceptions/ClientError");
const response = require("../helper/response");
const promos = require("../models/promos");
const product = require("../models/product");
const deleteFiles = require("../helper/delete");

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
    const { file = null } = req;
    if (file === null) {
      throw new InvariantError("Photo is required");
    }
    // upload cloud jika status production
    let imgUrl = null;
    if (file !== null) {
      imgUrl =
        process.env.STATUS === "production"
          ? await cloudinary.cloudUploadHandler(file.path)
          : file.path;
    }
    const filename = imgUrl;
    const body = { ...req.body, img: filename };
    await product.getJustProductById(req.body.product_id);
    const result = await promos.postPromos(body);
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
    const { file = null } = req;
    const { id } = req.params;
    let data = await promos.getPromosDetailById(id);

    if (file !== null && data.img !== null) {
      let publicId;
      if (process.env.STATUS === "production") {
        publicId = data.img.split("/")[7].split(".")[0];
      }
      process.env.STATUS === "production"
        ? await cloudinary.cloudDeleteHandler(publicId)
        : deleteFiles.imgFiles(data.img);
    }
    // upload cloud jika status production
    let imgUrl = null;
    if (file !== null) {
      imgUrl =
        process.env.STATUS === "production"
          ? await cloudinary.cloudUploadHandler(file.path)
          : file.path;
    }
    data.img = file !== null ? imgUrl : data.img;
    console.log(data);
    data.discount =
      req.body.discount !== undefined ? req.body.discount : data.discount;
    data.description =
      req.body.description !== undefined
        ? req.body.description
        : data.description;
    data.coupon = req.body.coupon !== undefined ? req.body.coupon : data.coupon;
    data.product_id =
      req.body.product_id !== undefined ? req.body.product_id : data.product_id;
    data.name = req.body.name !== undefined ? req.body.name : data.name;
    data.size = req.body.size !== undefined ? req.body.size : data.size;
    data.period_start =
      req.body.period_start !== undefined
        ? req.body.period_start
        : data.period_start;
    data.expire = req.body.expire !== undefined ? req.body.expire : data.expire;

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
    const img = await promos.deletePromosById(id);
    if (img !== null) {
      deleteFiles.imgFiles(img);
    }
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
