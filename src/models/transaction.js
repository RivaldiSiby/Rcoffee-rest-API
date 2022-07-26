const ClientError = require("../exceptions/ClientError");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const { getSalesByTransaction } = require("./sales");
const db = require("../config/db");

const postTransaction = async (id, body) => {
  try {
    const { user_id, coupon, delivery_cost, tax, payment_method } = body;
    const created_at = new Date().toISOString();
    const updated_at = created_at;
    const status = "processed";
    const query =
      "INSERT INTO transaction VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id";
    const result = await db.query(query, [
      id,
      user_id,
      coupon,
      delivery_cost,
      tax,
      created_at,
      updated_at,
      payment_method,
      "false",
      status,
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
      const { page = 1, limit = 12 } = queryData;
      const offset = parseInt(page - 1) * Number(limit);
      const querySql =
        "SELECT t.id, t.user_id, t.coupon,t.status, t.delivery_cost, t.tax,t.payment_method, t.created_at, t.updated_at, SUM(s.total) AS Item_Total,SUM(s.quantity) AS quantity_items FROM transaction t INNER JOIN sales s on t.id = s.transaction_id WHERE t.user_id = $1 AND t.deleted_at = 'false' GROUP BY t.id ORDER BY t.created_at desc LIMIT $2 OFFSET $3";
      const result = await db.query(querySql, [userdata.id, limit, offset]);
      const data = {
        data: result.rows,
      };
      const resultCount = await db.query(
        "SELECT COUNT(*) AS total FROM transaction WHERE user_id = $1 AND deleted_at = 'false'",
        [userdata.id]
      );
      // data pagination
      data.totalData = parseInt(resultCount.rows[0].total);
      data.totalPage = Math.ceil(data.totalData / parseInt(limit));
      return data;
    }

    if (id === null) {
      const { page = 1, limit = 12 } = queryData;
      const offset = parseInt(page - 1) * Number(limit);
      const querySql =
        "SELECT t.id, t.user_id,t.status, t.coupon, t.delivery_cost,t.payment_method, t.tax, t.created_at, t.updated_at, SUM(s.total) AS item_total, SUM(s.quantity) AS quantity_items FROM transaction t INNER JOIN sales s on t.id = s.transaction_id WHERE t.deleted_at = 'false' and t.status = 'processed' GROUP BY t.id LIMIT $1 OFFSET $2";

      const result = await db.query(querySql, [limit, offset]);
      const data = {
        data: result.rows,
      };
      // data pagination
      const count = await db.query(
        "SELECT COUNT(*) AS total FROM transaction WHERE deleted_at = 'false'"
      );
      data.totalData = parseInt(count.rows[0]["total"]);
      data.totalPage = Math.ceil(data.totalData / parseInt(limit));
      return data;
    }
    const query =
      "SELECT * FROM transaction WHERE id = $1 AND deleted_at = 'false'";
    const result = await db.query(query, [id]);
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

const getTransactionReport = async (report) => {
  try {
    let querySql =
      "SELECT t.id, t.user_id, t.coupon,t.status, t.delivery_cost, t.tax, t.created_at, t.updated_at, SUM(s.total) AS Item_Total,SUM(s.quantity) AS quantity_items FROM transaction t INNER JOIN sales s on t.id = s.transaction_id where t.created_at > now() - interval '6' ";
    querySql += `${report} GROUP BY t.id `;
    const result = await db.query(querySql);
    if (!result.rows.length) {
      throw new NotFoundError("Transaction Data is Not Found");
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
const softDelete = async (id) => {
  try {
    const deleted_at = new Date().toISOString();
    const query =
      "UPDATE transaction SET deleted_at = $2 WHERE id = $1 RETURNING id";
    const result = await db.query(query, [id, deleted_at]);
    if (!result.rows.length) {
      throw new NotFoundError("failed to delete data. Data not found");
    }
    return result.rows[0].img;
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
const doneTransaction = async (id) => {
  try {
    const query =
      "UPDATE transaction SET status = 'done' WHERE id = $1 RETURNING id";
    const result = await db.query(query, [id]);
    if (!result.rows.length) {
      throw new NotFoundError("Failed to confirm done . Data not found");
    }
    return result.rows[0].img;
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
    const result = await db.query(query, [id]);
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

module.exports = {
  softDelete,
  getTransactionReport,
  deleteTransactionById,
  getTransactions,
  postTransaction,
  doneTransaction,
};
