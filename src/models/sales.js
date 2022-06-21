const { nanoid } = require("nanoid");
const ClientError = require("../exceptions/ClientError");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const db = require("../config/db");
const postSales = async (body) => {
  try {
    const id = `sales-${nanoid(16)}`;
    const { stock_id, transaction_id, quantity, total } = body;
    const query = "INSERT INTO sales VALUES ($1,$2,$3,$4,$5) RETURNING id";

    const result = await db.query(query, [
      id,
      stock_id,
      transaction_id,
      parseInt(quantity),
      total,
    ]);

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

const getSalesByTransaction = async (transaction) => {
  try {
    const query =
      "SELECT p.id, p.name ,p.category, p.description, p.img, ss.transaction_id,  s.size, ss.quantity, s.price, ss.total, pp.discount,pp.coupon FROM sales ss INNER JOIN stock s ON ss.stock_id = s.id INNER JOIN transaction ts ON ss.transaction_id = ts.id INNER JOIN product p ON s.product_id = p.id LEFT JOIN promos pp ON s.product_id = pp.product_id WHERE transaction_id = $1 ";
    const querySum =
      "select SUM(ss.total) AS totaltransaction, SUM(ss.quantity) AS quantityitems FROM sales ss INNER JOIN stock s ON ss.stock_id = s.id INNER JOIN product p ON s.product_id  = p.id WHERE ss.transaction_id = $1 group by ss.transaction_id  ";
    const result = await db.query(query, [transaction]);
    const sumTotal = await db.query(querySum, [transaction]);
    if (!result.rows.length) {
      throw new NotFoundError(
        "Failed to ged Data Sales By Transaction. Data not Found "
      );
    }
    if (process.env.STATUS !== "production") {
      result.rows.map((item) => {
        const path = item.img.split("\\");
        item.img = `/${path[1]}/${path[2]}/${path[3]}`;
      });
    }

    result.rows = [
      ...result.rows,
      {
        item_total: sumTotal.rows[0].totaltransaction,
        quantity_items: sumTotal.rows[0].quantityitems,
      },
    ];

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

const getSales = async (id = null) => {
  try {
    if (id === null) {
      const query =
        "SELECT p.id, p.name ,p.category, p.description, p.img, ss.transaction_id,  s.size, ss.quantity, s.price, ss.total FROM sales ss INNER JOIN stock s ON ss.stock_id = s.id inner join product p on s.product_id  = p.id ORDER BY total DESC";
      const result = await db.query(query);
      if (!result.rows.length) {
        throw new NotFoundError("Data not Found ");
      }
      return result.rows;
    }
    const query =
      "SELECT p.id, p.name ,p.category, p.description, p.img, ss.transaction_id,  s.size, ss.quantity, s.price, ss.total FROM sales ss INNER JOIN stock s ON ss.stock_id = s.id inner join product p on s.product_id  = p.id WHERE id = $1 ORDER BY total DESC";
    const result = await db.query(query, [id]);
    if (!result.rows.length) {
      throw new NotFoundError(
        "Failed to ged Data Sales By Id. Data not Found "
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

const deleteSalesByTransaction = async (transaction) => {
  try {
    const query = "DELETE FROM sales WHERE transactin_id = $1 RETURNING id";
    const result = await db.query(query, [transaction]);
    if (!result.rows.length) {
      throw new NotFoundError(
        "Failed to delete Data Sales By Transaction. Data not Found "
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
  deleteSalesByTransaction,
  getSales,
  getSalesByTransaction,
  postSales,
};
