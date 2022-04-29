const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const dbconect = new Pool();

const postTransaction = async (id, body) => {
  const { quantity_items, user_id, coupon, delivery_cost, tax } = body;
  const created_at = new Date().toISOString();
  const updated_at = created_at;

  const query =
    "INSERT INTO transaction VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id";
  const result = await dbconect.query(query, [
    id,
    quantity_items,
    user_id,
    coupon,
    delivery_cost,
    tax,
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
    const query =
      "SELECT t.id, t.quantity_items, t.user_id, t.coupon, t.delivery_cost, t.tax, t.created_at, t.updated_at, SUM(s.total) AS Item_Total FROM transaction t INNER JOIN sales s on t.id = s.transaction_id GROUP BY t.id";

    const result = await dbconect.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Data Not Found");
    }
    return result.rows;
  }

  const query = "SELECT * FROM transaction WHERE id = $1";
  const result = await dbconect.query(query, [id]);
  if (!result.rows.length) {
    throw new NotFoundError("Transaction Data By Id is Not Found");
  }
  return result.rows[0];
};

const deleteTransactionById = async (id) => {
  const query = "DELETE FROM transaction WHERE id = $1 RETURNING id";
  const result = await dbconect.query(query, [id]);
  if (!result.rows.length) {
    throw new NotFoundError(
      "Failed to delete Data Transaction By Id. Data not Found "
    );
  }
  return result.rows;
};

module.exports = { deleteTransactionById, getTransactions, postTransaction };
