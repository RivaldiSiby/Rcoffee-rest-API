const { nanoid } = require("nanoid");
const ClientError = require("../exceptions/ClientError");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const bcrypt = require("bcrypt");
const db = require("../config/db");

const postMail = async (body) => {
  try {
    const id = `mail-${nanoid(16)}`;
    const { destination, purpose, code, expire } = body;

    const querySql =
      "INSERT into mail (id,destination,purpose,code,expire) values($1,$2,$3,$4,$5) returning id";
    const result = await db.query(querySql, [
      id,
      destination,
      purpose,
      code,
      expire,
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
const verifyEmail = async (email) => {
  try {
    let sqlQuery =
      "UPDATE users SET status='active' WHERE email=$1 RETURNING id";
    const result = await db.query(sqlQuery, [email]);
    if (!result.rows.length)
      throw new ErrorHandler({ status: 404, message: "User Not Found" });
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
const resetPass = async (email, code, password) => {
  try {
    // cek code email
    const query =
      "DELETE FROM mail WHERE destination = $1 AND code = $2 returning id";
    const data = await db.query(query, [email, code]);
    if (!data.rows.length) throw new NotFoundError("email and code not valid");
    // update pass
    const hashPassword = await bcrypt.hash(password, 10);
    let sqlQuery = "UPDATE users SET password=$2 WHERE email=$1 RETURNING id";
    const result = await db.query(sqlQuery, [email, hashPassword]);
    if (!result.rows.length) throw new NotFoundError("user not found");
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
const getMail = async (email) => {
  try {
    const query = "SELECT * FROM mail WHERE destination = $1";
    const result = await db.query(query, [email]);
    if (!result.rows.length) {
      throw new InvariantError("Mail confirm notfound");
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
const deleteMail = async (email) => {
  try {
    const query = "DELETE FROM mail WHERE destination = $1";
    await db.query(query, [email]);
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

module.exports = { resetPass, verifyEmail, postMail, getMail, deleteMail };
