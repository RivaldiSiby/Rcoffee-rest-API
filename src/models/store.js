const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const dbconect = new Pool();

const getStore = async () => {
  const query = "SELECT * FROM store";

  const result = await dbconect.query(query);
  return result;
};
const getStoreById = async (id) => {
  const query = "SELECT * FROM store WHERE id=$1";

  const result = await dbconect.query(query, [id]);
  if (!result.rows.length) {
    throw new NotFoundError("Data not found");
  }
  return result.rows;
};

const postStore = async (body) => {
  const id = nanoid(16);
  const { name, owner, description } = body;

  const haveStore = await getStore();
  if (haveStore.rowCount > 0) {
    throw new InvariantError("Store has been inserted");
  }
  const query = "INSERT INTO store VALUES($1,$2,$3,$4) RETURNING id";
  const result = await dbconect.query(query, [id, name, owner, description]);

  if (result.rows.length === 0) {
    throw new InvariantError("failed to add data");
  }
  return result.rows[0].id;
};

const putStoreById = async (id, body) => {
  const { name, owner, description } = body;
  const haveStore = await getStore();
  if (haveStore.rowCount === 0) {
    throw new InvariantError("Store has not been inserted");
  }

  const query =
    "UPDATE store SET name=$2, owner=$3, description=$4 WHERE id=$1 RETURNING id";
  const result = await dbconect.query(query, [id, name, owner, description]);
  if (!result.rows.length) {
    throw new NotFoundError("failed to update data. Data not found");
  }
  return result.rows[0].id;
};

const deleteStoreById = async (id) => {
  const query = "DELETE FROM store WHERE id=$1 RETURNING id";
  const result = await dbconect.query(query, [id]);
  if (!result.rows.length) {
    throw new NotFoundError("failed to delete data. Data not found");
  }
  return result.rows[0].id;
};

module.exports = {
  postStore,
  getStore,
  putStoreById,
  deleteStoreById,
  getStoreById,
};
