const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const ClientError = require("../exceptions/ClientError");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const bcrypt = require("bcrypt");
const dbconect = new Pool();

const registerUser = async (body) => {
  try {
    const id = `user-${nanoid(16)}`;
    const role = "role-vn3RBLGG7AUlHjta";
    const { email, password, phone } = body;
    const created_at = new Date().toISOString();
    const updated_at = created_at;
    const hashPassword = await bcrypt.hash(password, 10);

    const query =
      "INSERT INTO users (id, email, password, phone, role, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id";
    const result = await dbconect.query(query, [
      id,
      email,
      hashPassword,
      phone,
      role,
      created_at,
      updated_at,
    ]);
    if (!result.rows.length) {
      throw new InvariantError("Failed to Register");
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
const verifyUserByEmail = async (email) => {
  try {
    const query =
      "SELECT u.id,u.email,u.password,u.img,r.name AS role FROM users u INNER JOIN role r ON u.role = r.id WHERE email = $1";
    const result = await dbconect.query(query, [email]);
    if (!result.rows.length) {
      throw new InvariantError("Email is not registered Or Password is Wrong");
    }
    const path = result.rows[0].img.split("\\");
    result.rows[0].img = `/${path[1]}/${path[2]}/${path[3]}`;
    return result.rows[0];
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    if (error instanceof ClientError) {
      throw error;
    }
    throw new Error(error.message);
  }
};
const verifyByEmail = async (email) => {
  try {
    const query = "SELECT email FROM users WHERE email = $1";
    const result = await dbconect.query(query, [email]);
    if (result.rows[0] !== undefined) {
      throw new InvariantError("Email is already in use");
    }
    return result.rows[0];
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    if (error instanceof ClientError) {
      throw error;
    }
    throw new Error(error.message);
  }
};
const postToken = async (token) => {
  try {
    const id = `token-${nanoid(16)}`;
    const query = "INSERT INTO auth VALUES ($1,$2) RETURNING id";
    const result = await dbconect.query(query, [id, token]);
    if (!result.rows.length) {
      throw new InvariantError("Failed to add token");
    }
    return result.rows[0].id;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    if (error instanceof ClientError) {
      throw error;
    }
    throw new Error(error.message);
  }
};
const verifyRefreshToken = async (token) => {
  try {
    const query = "SELECT token FROM auth WHERE token = $1";
    const result = await dbconect.query(query, [token]);
    if (!result.rows.length) {
      throw new InvariantError("Refresh Token not valid");
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    if (error instanceof ClientError) {
      throw error;
    }
    throw new Error(error.message);
  }
};
const deleteRefreshToken = async (token) => {
  try {
    const query = "DELETE FROM auth WHERE token = $1";
    const result = await dbconect.query(query, [token]);
    if (!result.rows.length) {
      throw new InvariantError("Refresh Token not valid");
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    if (error instanceof ClientError) {
      throw error;
    }
    throw new Error(error.message);
  }
};

module.exports = {
  verifyUserByEmail,
  verifyByEmail,
  registerUser,
  verifyRefreshToken,
  postToken,
  deleteRefreshToken,
};
