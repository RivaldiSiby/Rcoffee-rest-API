const ClientError = require("../exceptions/ClientError");
const response = require("../helper/response");
const product = require("../models/product");
const stock = require("../models/stock");
const deleteFiles = require("../helper/delete");
const InvariantError = require("../exceptions/InvariantError");
const cloudinary = require("../helper/uploadCloudinary");

const readJustProducts = async (req, res) => {
  try {
    const result = await product.getJustProduct();
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
const readProducts = async (req, res) => {
  try {
    req.query.page = req.query.page === undefined ? 1 : req.query.page;
    const result = await product.getProducts(req.query);

    // pagination
    const { totalData, totalPage, data } = result;

    const nextPage = parseInt(req.query.page) + 1;
    const prevPage = parseInt(req.query.page) - 1;
    // path query
    let queryPath = "";
    queryPath += req.query.sort !== undefined ? `sort=${req.query.sort}&` : "";
    queryPath +=
      req.query.order !== undefined ? `order=${req.query.order}&` : "";
    queryPath +=
      req.query.category !== undefined ? `category=${req.query.category}&` : "";
    queryPath += req.query.name !== undefined ? `name=${req.query.name}&` : "";
    queryPath +=
      req.query.limit !== undefined ? `limit=${req.query.limit}&` : "";
    // path query
    let next =
      nextPage > totalPage
        ? {}
        : { next: `/product?${queryPath}page=${nextPage}` };
    let prev =
      req.query.page <= 1
        ? {}
        : { prev: `/product?${queryPath}page=${prevPage}` };
    const meta = {
      totalData: totalData,
      totalPage: totalPage,
      page: req.query.page,
      ...next,
      ...prev,
    };
    return response.isSuccessHavePagination(
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
    //   error server
    console.log(error);
    return response.isError(
      res,
      500,
      "Sorry, there was a failure on our server"
    );
  }
};
const readFavoriteProducts = async (req, res) => {
  try {
    req.query.page = req.query.page === undefined ? 1 : req.query.page;
    const result = await product.getFavoriteProducts(req.query);

    // pagination
    const { totalData, totalPage, data } = result;

    const nextPage = parseInt(req.query.page) + 1;
    const prevPage = parseInt(req.query.page) - 1;
    // path query
    let queryPath = "";
    queryPath +=
      req.query.category !== undefined ? `category=${req.query.category}&` : "";
    queryPath += req.query.name !== undefined ? `name=${req.query.name}&` : "";
    queryPath +=
      req.query.limit !== undefined ? `limit=${req.query.limit}&` : "";
    // path query
    let next =
      nextPage > totalPage
        ? {}
        : { next: `/product?${queryPath}page=${nextPage}` };
    let prev =
      req.query.page <= 1
        ? {}
        : { prev: `/product?${queryPath}page=${prevPage}` };
    const meta = {
      totalData: totalData,
      totalPage: totalPage,
      page: req.query.page,
      ...next,
      ...prev,
    };
    return response.isSuccessHavePagination(
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
    let data = await product.getJustProductById(id);
    // atur data patch
    // hapus gambar
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
    data.name = req.body.name !== undefined ? req.body.name : data.name;
    data.description =
      req.body.description !== undefined
        ? req.body.description
        : data.description;
    data.category =
      req.body.category !== undefined ? req.body.category : data.category;
    data.img = req.body.img !== undefined ? req.body.img : data.img;
    await product.patchProduct(id, data);

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
const softDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await product.softDelete(id);
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
const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    await stock.deleteStockByProduct(id);
    const img = await product.deleteProductById(id);
    if (img !== null) {
      deleteFiles.imgFiles(img);
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
  softDeleteProduct,
  readProducts,
  readFavoriteProducts,
  readProductById,
  createProduct,
  editProductById,
  deleteProductById,
  readJustProducts,
};
