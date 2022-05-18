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
      "SELECT u.id,u.email,u.password,r.name AS role FROM users u INNER JOIN role r ON u.role = r.id WHERE email = $1";
    const result = await dbconect.query(query, [email]);
    if (!result.rows.length) {
      throw new InvariantError("Email is not registered Or Password is Wrong");
    }
    console.log(result.rows[0]);
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

module.exports = { verifyUserByEmail, verifyByEmail, registerUser };
