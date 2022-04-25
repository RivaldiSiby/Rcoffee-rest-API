const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const dbconect = new Pool();

const getPromosAll = async () => {
  const query = "SELECT * FROM promos";
  const result = await dbconect.query(query);
  return result;
};

const getPromosById = async (id) => {
  const query = "SELECT * FROM promos WHERE id=$1";
  const result = await dbconect.query(query, [id]);

  if (!result.rows.length) {
    throw new NotFoundError("Data not Found");
  }
  return result.rows[0];
};
const postPromos = async (body) => {
  const id = `discount-${nanoid(16)}`;
  const { discount, description } = body;
  const created_at = new Date().toISOString();
  const updated_at = created_at;
  const query = "INSERT INTO promos VALUES ($1,$2,$3,$4,$5) RETURNING id";
  const result = await dbconect.query(query, [
    id,
    discount,
    description,
    created_at,
    updated_at,
  ]);

  if (!result.rows.length) {
    throw new InvariantError("failed to add data");
  }
  return result.rows[0].id;
};

const putPromosById = async (id, body) => {
  const { discount, description } = body;
  const updated_at = new Date().toISOString();
  const query =
    "UPDATE promos SET discount=$1, description=$2, updated_at=$3 WHERE id=$4 RETURNING id";
  const result = await dbconect.query(query, [
    discount,
    description,
    updated_at,
    id,
  ]);

  if (!result.rows.length) {
    throw new NotFoundError("failed to update data. Data not Found");
  }
  return result.rows[0].id;
};

const deletePromosById = async (id) => {
  const query = "DELETE FROM promos WHERE id = $1 RETURNING id";
  const result = await dbconect.query(query, [id]);

  if (!result.rows.length) {
    throw new NotFoundError("failed to delete data. Data not Found");
  }
  return result.rows[0].id;
};

module.exports = {
  getPromosAll,
  getPromosById,
  postPromos,
  putPromosById,
  deletePromosById,
};
