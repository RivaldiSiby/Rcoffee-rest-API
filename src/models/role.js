const { nanoid } = require("nanoid");
const ClientError = require("../exceptions/ClientError");
const NotFoundError = require("../exceptions/NotFoundError");
const db = require("../config/db");
const getRole = async (id = null) => {
  try {
    if (id === null) {
      const querySQL = "SELECT * FROM role";
      const result = await db.query(querySQL);
      return result.rows;
    }
    const querySQL = "SELECT * FROM role WHERE id = $1";
    const result = await db.query(querySQL, [id]);
    if (!result.rows.length) {
      throw new NotFoundError("Role Data By Id is Not Found");
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

const postRole = async (body) => {
  try {
    const { name } = body;
    const id = `role-${nanoid(16)}`;
    const querySQL = "INSERT INTO role VALUES ($1,$2) RETURNING id";
    const result = await db.query(querySQL, [id, name]);
    if (!result.rows.length) {
      throw new InvariantError("failed to add data");
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

const deleteRoleById = async (id) => {
  try {
    const querySQL = "DELETE FROM role WHERE id = $1 RETURNING id";
    const result = await db.query(querySQL, [id]);
    if (!result.rows.length) {
      throw new NotFoundError("failed to delete data. Data not found");
    }
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

module.exports = { getRole, postRole, deleteRoleById };
