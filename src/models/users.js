const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const ClientError = require("../exceptions/ClientError");
const dbconect = new Pool();

const getUsers = async () => {
  try {
    const query =
      "SELECT id,name,email,phone,date_birth,gender,address FROM users";
    const result = await dbconect.query(query);
    return result;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new NotFoundError(error.message);
    }
    if (error instanceof ClientError) {
      throw new NotFoundError(error.message);
    }
    throw new Error(error.message);
  }
};

const getUserById = async (id) => {
  try {
    const query =
      "SELECT id,name,email,phone,date_birth,gender,address FROM users WHERE id = $1 ";
    const result = await dbconect.query(query, [id]);
    if (!result.rows.length) {
      throw new NotFoundError("User Data By Id is not Found");
    }
    return result.rows;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new NotFoundError(error.message);
    }
    if (error instanceof ClientError) {
      throw new NotFoundError(error.message);
    }
    throw new Error(error.message);
  }
};
const getUserByIdAllData = async (id) => {
  try {
    const query = "SELECT * FROM users WHERE id = $1 ";
    const result = await dbconect.query(query, [id]);
    if (!result.rows.length) {
      throw new NotFoundError("User Data By Id is not Found");
    }
    return result.rows;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new NotFoundError(error.message);
    }
    if (error instanceof ClientError) {
      throw new NotFoundError(error.message);
    }
    throw new Error(error.message);
  }
};

const postUser = async (body) => {
  try {
    const id = `user-${nanoid(16)}`;
    const {
      name,
      email,
      password,
      phone,
      date_birth,
      gender,
      address,
      role,
      img,
    } = body;
    const created_at = new Date().toISOString();
    const updated_at = created_at;
    const hashPassword = await bcrypt.hash(password, 10);

    const query =
      "INSERT INTO users VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id";
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
      img,
    ]);
    if (!result.rows.length) {
      throw new InvariantError("Failed to add data");
    }
    return result.rows[0].id;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new NotFoundError(error.message);
    }
    if (error instanceof ClientError) {
      throw new NotFoundError(error.message);
    }
    throw new Error(error.message);
  }
};

const patchUserById = async (id, body) => {
  try {
    const { name, email, password, phone, date_birth, gender, address, role } =
      body;
    const hashPassword =
      password.length >= 60 ? password : await bcrypt.hash(password, 10);
    const updated_at = new Date().toISOString();
    const query =
      "UPDATE users SET name=$1, email=$2, password=$3, phone=$4, date_birth=$5, gender=$6, address=$7, role=$8, updated_at=$9 WHERE id=$10 RETURNING id";
    const result = await dbconect.query(query, [
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
    ]);
    if (!result.rows.length) {
      throw new NotFoundError("Failed to update data. Data not Found");
    }
    return result.rows[0].id;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new NotFoundError(error.message);
    }
    if (error instanceof ClientError) {
      throw new NotFoundError(error.message);
    }
    throw new Error(error.message);
  }
};

const deleteUserById = async (id) => {
  try {
    const query = "DELETE FROM users WHERE id = $1 RETURNING id";
    const result = await dbconect.query(query, [id]);
    if (!result.rows.length) {
      throw new NotFoundError("Failed to delete data. Data not Found");
    }
    return result.rows[0].id;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new NotFoundError(error.message);
    }
    if (error instanceof ClientError) {
      throw new NotFoundError(error.message);
    }
    throw new Error(error.message);
  }
};

module.exports = {
  getUsers,
  getUserById,
  getUserByIdAllData,
  postUser,
  patchUserById,
  deleteUserById,
};
