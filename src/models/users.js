const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const dbconect = new Pool();

const getUsers = async () => {
  const query =
    "SELECT id,name,email,phone,date_birth,gender,address FROM users";
  const result = await dbconect.query(query);
  return result;
};

const getUserById = async (id) => {
  const query =
    "SELECT id,name,email,phone,date_birth,gender,address FROM users WHERE id = $1 ";
  const result = await dbconect.query(query, [id]);
  if (!result.rows.length) {
    throw new NotFoundError("User Data By Id is not Found");
  }
  return result.rows;
};

const postUser = async (body) => {
  const id = `user-${nanoid(16)}`;
  const { name, email, password, phone, date_birth, gender, address, role } =
    body;
  const created_at = new Date().toISOString();
  const updated_at = created_at;
  const hashPassword = await bcrypt.hash(password, 10);

  const query =
    "INSERT INTO users VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id";
  const result = await dbconect.query(query, [
    id,
    name,
    email,
    hashPassword,
    phone,
    date_birth,
    gender,
    address,
    role,
    created_at,
    updated_at,
  ]);
  if (!result.rows.length) {
    throw new InvariantError("Failed to add data");
  }
  return result.rows[0].id;
};

const putUserById = async (id, body) => {
  const { name, email, password, phone, date_birth, gender, address, role } =
    body;
  const updated_at = new Date().toISOString();

  const haveName = name !== undefined ? "name='" + name + "'," : "";
  const haveEmail = email !== undefined ? "email='" + email + "'," : "";
  let havePassword = "";
  if (password !== undefined && password.length > 0) {
    const hashPassword = await bcrypt.hash(password, 10);
    havePassword = "password='" + hashPassword + "',";
  }
  const havePhone = phone !== undefined ? "phone='" + phone + "'," : "";
  const haveDate_birth =
    date_birth !== undefined ? "date_birth='" + date_birth + "'," : "";
  const haveGender = gender !== undefined ? "gender='" + gender + "'," : "";
  const haveAddress = address !== undefined ? "address='" + address + "'," : "";
  const haveRole = role !== undefined ? "role='" + role + "'," : "";

  const query =
    "UPDATE users SET " +
    haveName +
    haveEmail +
    havePassword +
    havePhone +
    haveDate_birth +
    haveGender +
    haveAddress +
    haveRole +
    " updated_at=$2 WHERE id=$1 RETURNING id";
  const result = await dbconect.query(query, [id, updated_at]);
  if (!result.rows.length) {
    throw new NotFoundError("Failed to update data. Data not Found");
  }
  return result.rows[0].id;
};

const deleteUserById = async (id) => {
  const query = "DELETE FROM users WHERE id = $1 RETURNING id";
  const result = await dbconect.query(query, [id]);
  if (!result.rows.length) {
    throw new NotFoundError("Failed to delete data. Data not Found");
  }
  return result.rows[0].id;
};

module.exports = {
  getUsers,
  getUserById,
  postUser,
  putUserById,
  deleteUserById,
};
