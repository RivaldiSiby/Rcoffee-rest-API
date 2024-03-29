const { nanoid } = require("nanoid");
const ClientError = require("../exceptions/ClientError");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const bcrypt = require("bcrypt");
const db = require("../config/db");

const registerUser = async (body) => {
  try {
    const id = `user-${nanoid(16)}`;
    const role = "role-vn3RBLGG7AUlHjta";
    const { email, password, phone } = body;
    const created_at = new Date().toISOString();
    const updated_at = created_at;
    const hashPassword = await bcrypt.hash(password, 10);
    const status = "inactive";

    const query =
      "INSERT INTO users (id, email, password, phone, role, created_at, updated_at,status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING email";
    const result = await db.query(query, [
      id,
      email,
      hashPassword,
      phone,
      role,
      created_at,
      updated_at,
      status,
    ]);
    if (!result.rows.length) {
      throw new InvariantError("Failed to Register");
    }
    return result.rows[0].email;
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
    const result = await db.query(query, [email]);
    if (!result.rows.length) {
      throw new InvariantError("Email is not registered Or Password is Wrong");
    }
    if (process.env.STATUS !== "production") {
      if (result.rows[0].img !== null) {
        const path = result.rows[0].img.split("\\");
        result.rows[0].img = `/${path[1]}/${path[2]}/${path[3]}`;
      }
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
const verifyByEmail = async (email) => {
  try {
    const query = "SELECT email FROM users WHERE email = $1";
    const result = await db.query(query, [email]);
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
const cekEmail = async (email) => {
  try {
    const query = "SELECT email FROM users WHERE email = $1";
    const result = await db.query(query, [email]);
    if (!result.rows.length) {
      throw new InvariantError("Email is not registered ");
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
const getAdminOnline = async () => {
  try {
    const query =
      "select a.* from auth a inner join users u on a.user_id = u.id inner join role r on u.role = r.id where r.name = 'admin' and a.device = 'android' OR a.device = 'ios' ";
    const result = await db.query(query);
    return result.rows;
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
const postToken = async (data) => {
  try {
    const { token, device, notification_token, user_id } = data;
    const id = `token-${nanoid(16)}`;
    const query = "INSERT INTO auth VALUES ($1,$2,$3,$4,$5) RETURNING id";
    const result = await db.query(query, [
      id,
      token,
      device,
      notification_token,
      user_id,
    ]);
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
    const result = await db.query(query, [token]);
    if (!result.rows.length) {
      throw new InvariantError("Refresh Token not valid");
    }
    return;
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
const deleteSameAuht = async (device, user_id, notification_token) => {
  try {
    const query =
      "DELETE FROM auth WHERE device = $1 AND user_id = $2 AND notification_token = $3 returning id";
    await db.query(query, [device, user_id, notification_token]);

    return;
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
    const result = await db.query(query, [token]);
    if (!result.rows.length) {
      throw new InvariantError("Refresh Token not valid");
    }
    return;
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
  cekEmail,
  getAdminOnline,
  deleteSameAuht,
};
