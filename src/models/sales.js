const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const dbconect = new Pool();

const postSales = async (body) => {
  const id = `sales-${nanoid(16)}`;
  const { stock_id, transaction_id, quantity, total } = body;
  const query = "INSERT INTO sales VALUES ($1,$2,$3,$4,$5) RETURNING id";

  const result = await dbconect.query(query, [
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
};

const getSalesByTransaction = async (transaction) => {
  const query =
    "SELECT p.id, p.name ,p.category, p.description, p.img, ss.transaction_id,  s.size, ss.quantity, s.price_unit, ss.total, pp.discount FROM sales ss INNER JOIN stock s ON ss.stock_id = s.id INNER JOIN product p ON s.product_id = p.id LEFT JOIN promos pp ON s.product_id = pp.product_id WHERE transaction_id = $1 ";
  const querySum =
    "select SUM(ss.total) AS totaltransaction FROM sales ss INNER JOIN stock s ON ss.stock_id = s.id INNER JOIN product p ON s.product_id  = p.id WHERE ss.transaction_id = $1 group by ss.transaction_id  ";
  const result = await dbconect.query(query, [transaction]);
  const sumTotal = await dbconect.query(querySum, [transaction]);
  if (!result.rows.length) {
    throw new NotFoundError(
      "Failed to ged Data Sales By Transaction. Data not Found "
    );
  }

  result.rows = [
    ...result.rows,
    { item_total: sumTotal.rows[0].totaltransaction },
  ];

  return result.rows;
};

const getSales = async (id = null) => {
  if (id === null) {
    const query =
      "SELECT p.id, p.name ,p.category, p.description, p.img, ss.transaction_id,  s.size, ss.quantity, s.price_unit, ss.total FROM sales ss INNER JOIN stock s ON ss.stock_id = s.id inner join product p on s.product_id  = p.id ORDER BY total DESC";
    const result = await dbconect.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Data not Found ");
    }
    return result.rows;
  }
  const query =
    "SELECT p.id, p.name ,p.category, p.description, p.img, ss.transaction_id,  s.size, ss.quantity, s.price_unit, ss.total FROM sales ss INNER JOIN stock s ON ss.stock_id = s.id inner join product p on s.product_id  = p.id WHERE id = $1 ORDER BY total DESC";
  const result = await dbconect.query(query, [id]);
  if (!result.rows.length) {
    throw new NotFoundError("Failed to ged Data Sales By Id. Data not Found ");
  }
  return result.rows;
};

const deleteSalesByTransaction = async (transaction) => {
  const query = "DELETE FROM sales WHERE transactin_id = $1 RETURNING id";
  const result = await dbconect.query(query, [transaction]);
  if (!result.rows.length) {
    throw new NotFoundError(
      "Failed to delete Data Sales By Transaction. Data not Found "
    );
  }
  return result.rows;
};

module.exports = {
  deleteSalesByTransaction,
  getSales,
  getSalesByTransaction,
  postSales,
};
