const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const dbconect = new Pool();

const getUsers = async () => {
  const query = "SELECT * FROM users";
  const result = await dbconect.query(query);
  return result;
};

const getUserById = async (id) => {
  const query = "SELECT * FROM users WHERE id = $1 ";
  const result = await dbconect.query(query, [id]);
  if (!result.rows.length) {
    throw new NotFoundError("Data not Found");
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

  const hashPassword = await bcrypt.hash(password, 10);

  const query =
    "UPDATE users SET name=$1, email=$2, password=$3, phone=$4, date_birth=$5, gender=$6, address=$7,role=$8, updated_at=$9 WHERE id=$10 RETURNING id";

  const values =
    password.length > 0
      ? [
          name,
          email,
          hashPassword,
          phone,
          date_birth,
          gender,
          address,
          role,
          updated_at,
          id,
        ]
      : [name, email, phone, date_birth, gender, address, role, updated_at, id];

  const result = await dbconect.query(query, values);
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
