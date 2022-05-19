const { Pool } = require("pg");
const ClientError = require("../exceptions/ClientError");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const dbconect = new Pool();

const postTransaction = async (id, body) => {
  try {
    const { user_id, coupon, delivery_cost, tax } = body;
    const created_at = new Date().toISOString();
    const updated_at = created_at;

    const query =
      "INSERT INTO transaction VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id";
    const result = await dbconect.query(query, [
      id,
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

const getTransactions = async (userdata = null, id = null, queryData) => {
  try {
    // cek userdata dan role adalah costumer atau bukan
    if (userdata !== null && userdata.role === "costumer") {
      const { page = 1, limit = 3 } = queryData;
      const offset = parseInt(page - 1) * Number(limit);
      const querySql =
        "SELECT t.id, t.user_id, t.coupon, t.delivery_cost, t.tax, t.created_at, t.updated_at, SUM(s.total) AS Item_Total,SUM(s.quantity) AS quantity_items FROM transaction t INNER JOIN sales s on t.id = s.transaction_id WHERE t.user_id = $1 GROUP BY t.id LIMIT $2 OFFSET $3 ";
      const result = await dbconect.query(querySql, [
        userdata.id,
        limit,
        offset,
      ]);
      const data = {
        data: result.rows,
      };
      // data pagination
      data.totalData = parseInt(result.rowCount);
      data.totalPage = Math.ceil(data.totalData / parseInt(limit));
      return data;
    }

    if (id === null) {
      const { page = 1, limit = 3 } = queryData;
      const offset = parseInt(page - 1) * Number(limit);
      const querySql =
        "SELECT t.id, t.user_id, t.coupon, t.delivery_cost, t.tax, t.created_at, t.updated_at, SUM(s.total) AS Item_Total,SUM(s.quantity) AS quantity_items FROM transaction t INNER JOIN sales s on t.id = s.transaction_id GROUP BY t.id LIMIT $1 OFFSET $2";

      const result = await dbconect.query(querySql, [limit, offset]);
      const data = {
        data: result.rows,
      };
      // data pagination
      const count = await dbconect.query(
        "SELECT COUNT(*) AS total FROM transaction"
      );
      data.totalData = parseInt(count.rows[0]["total"]);
      data.totalPage = Math.ceil(data.totalData / parseInt(limit));
      return data;
    }

    const query = "SELECT * FROM transaction WHERE id = $1";
    const result = await dbconect.query(query, [id]);
    if (!result.rows.length) {
      throw new NotFoundError("Transaction Data By Id is Not Found");
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

const deleteTransactionById = async (id) => {
  try {
    const query = "DELETE FROM transaction WHERE id = $1 RETURNING id";
    const result = await dbconect.query(query, [id]);
    if (!result.rows.length) {
      throw new NotFoundError(
        "Failed to delete Data Transaction By Id. Data not Found "
      );
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

module.exports = { deleteTransactionById, getTransactions, postTransaction };
