const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const dbconect = new Pool();

const postTransaction = async (id, body) => {
  const { quantity_item, costumer, coupon, price, delivery_cost, tax, total } =
    body;
  const created_at = new Date().toISOString();
  const updated_at = created_at;

  const query =
    "INSERT INTO transaction VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id";
  const result = await dbconect.query(query, [
    id,
    quantity_item,
    costumer,
    coupon,
    price,
    delivery_cost,
    tax,
    total,
    created_at,
    updated_at,
  ]);
  if (!result.rows.length) {
    throw InvariantError("Failed to add Data");
  }
  return result.rows[0].id;
};

const getTransactions = async (id = null) => {
  if (id === null) {
    const query = "SELECT * FROM transaction WHERE id = $1";
    const result = await dbconect.query(query, [id]);
    if (!result.rows.length) {
      throw new NotFoundError("Data Not Found");
    }
    return result.rows[0];
  }
  const query = "SELECT * FROM transaction ";
  const result = await dbconect.query(query);
  if (!result.rows.length) {
    throw new NotFoundError("Data Not Found");
  }
  return result.rows;
};

module.exports = { getTransactions, postTransaction };
