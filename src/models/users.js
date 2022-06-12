const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const ClientError = require("../exceptions/ClientError");
const dbconect = new Pool();

const getUsers = async (query) => {
  try {
    // pagination
    const { page = 1, limit = 3 } = query;
    const offset = parseInt(page - 1) * Number(limit);
    const querySql =
      "SELECT u.id,u.name,u.email,u.phone,u.date_birth,u.gender,u.address,u.img,r.name as role FROM users u INNER JOIN role r ON u.role = r.id LIMIT $1 OFFSET $2";
    const result = await dbconect.query(querySql, [limit, offset]);

    result.rows.map((item) => {
      path = item.img.split("\\");
      item.img = `/${path[1]}/${path[2]}/${path[3]}`;
    });
    const data = {
      data: result.rows,
    };
    // data pagination
    const count = await dbconect.query("SELECT COUNT(*) AS total FROM users");
    data.totalData = parseInt(count.rows[0]["total"]);
    data.totalPage = Math.ceil(data.totalData / parseInt(limit));
    return data;
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
      "SELECT u.id,u.name,u.email,u.phone,u.date_birth,u.gender,u.address,u.img,u.last_name,u.first_name,r.name as role  FROM users u INNER JOIN role r ON u.role = r.id WHERE u.id = $1 ";
    const result = await dbconect.query(query, [id]);
    if (!result.rows.length) {
      throw new NotFoundError("User Data By Id is not Found");
    }
    // generate img link
    if (result.rows[0].img !== null) {
      const path = result.rows[0].img.split("\\");
      result.rows[0].img = `/${path[1]}/${path[2]}/${path[3]}`;
    }
    return result.rows[0];
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
      first_name,
      last_name,
    } = body;
    const hashPassword =
      password.length >= 60 ? password : await bcrypt.hash(password, 10);
    const updated_at = new Date().toISOString();
    const query =
      "UPDATE users SET name=$1, email=$2, password=$3, phone=$4, date_birth=$5, gender=$6, address=$7, role=$8, updated_at=$9,img=$10,first_name=$11,last_name=$12 WHERE id=$13 RETURNING id";
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
      img,
      first_name,
      last_name,
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
