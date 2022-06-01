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
  return response.isSuccessHaveAllData(
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
    const filename = file !== null ? file.path : null;
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
    if (file !== null && data[0].img !== null) {
      await deleteFiles.imgFiles(data[0].img);
    }
    // atur data patch
    data[0].img = file !== null ? file.path : data[0].img;
    data[0].name = req.body.name !== undefined ? req.body.name : data[0].name;
    data[0].first_name =
      req.body.first_name !== undefined
        ? req.body.first_name
        : data[0].first_name;
    data[0].last_name =
      req.body.last_name !== undefined ? req.body.last_name : data[0].last_name;
    data[0].email =
      req.body.email !== undefined ? req.body.email : data[0].email;
    data[0].password =
      req.body.password !== undefined ? req.body.password : data[0].password;
    data[0].phone =
      req.body.phone !== undefined ? req.body.phone : data[0].phone;
    data[0].date_birth =
      req.body.date_birth !== undefined
        ? req.body.date_birth
        : data[0].date_birth;
    data[0].gender =
      req.body.gender !== undefined ? req.body.gender : data[0].gender;
    data[0].address =
      req.body.address !== undefined ? req.body.address : data[0].address;
    data[0].role = req.body.role !== undefined ? req.body.role : data[0].role;
    // hapus gambar

    await users.patchUserById(id, data[0]);

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
