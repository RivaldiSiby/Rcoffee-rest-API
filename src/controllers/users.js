const users = require("../models/users");
const response = require("../helper/response");
const ClientError = require("../exceptions/ClientError");
const decode = require("../helper/docedeToken");
const deleteFiles = require("../helper/delete");
const InvariantError = require("../exceptions/InvariantError");

const readUsers = async (req, res) => {
  req.query.page = req.query.page === undefined ? 1 : req.query.page;
  const result = await users.getUsers(req.query);
  const { totalData, totalPage, data } = result;

  const nextPage = parseInt(req.query.page) + 1;
  const prevPage = parseInt(req.query.page) - 1;
  // path query
  let queryPath = "";
  queryPath += req.query.limit !== undefined ? `limit=${req.query.limit}&` : "";
  // path query
  let next =
    nextPage > totalPage ? {} : { next: `/users?${queryPath}page=${nextPage}` };
  let prev =
    req.query.page <= 1 ? {} : { prev: `/users?${queryPath}page=${prevPage}` };
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
};

const readUserById = async (req, res) => {
  try {
    const payload = await decode.decodeToken(req.header("Authorization"));

    const id = payload.id;
    const result = await users.getUserById(id);

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

const createUser = async (req, res) => {
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
    const result = await users.postUser(body);
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

const editUserById = async (req, res) => {
  try {
    const { file = null } = req;

    const payload = await decode.decodeToken(req.header("Authorization"));

    const id = payload.id;
    let data = await users.getUserByIdAllData(id);

    // hapus gambar lama
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
    // atur data patch
    data.name = req.body.name !== undefined ? req.body.name : data.name;
    data.first_name =
      req.body.first_name !== undefined ? req.body.first_name : data.first_name;
    data.last_name =
      req.body.last_name !== undefined ? req.body.last_name : data.last_name;
    data.email = req.body.email !== undefined ? req.body.email : data.email;
    data.password =
      req.body.password !== undefined ? req.body.password : data.password;
    data.phone = req.body.phone !== undefined ? req.body.phone : data.phone;
    data.date_birth =
      req.body.date_birth !== undefined ? req.body.date_birth : data.date_birth;
    data.gender = req.body.gender !== undefined ? req.body.gender : data.gender;
    data.address =
      req.body.address !== undefined ? req.body.address : data.address;
    data.role = req.body.role !== undefined ? req.body.role : data.role;
    // hapus gambar

    await users.patchUserById(id, data);

    return response.isSuccessNoData(res, 200, "Update Data has been success");
  } catch (error) {
    console.log(error);
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

const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const img = await users.deleteUserById(id);
    // hapus gambar
    if (img !== null) {
      await deleteFiles.imgFiles(img);
    }
    return response.isSuccessNoData(res, 200, "Delete Data has been Success");
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
  readUsers,
  readUserById,
  createUser,
  editUserById,
  deleteUserById,
};
