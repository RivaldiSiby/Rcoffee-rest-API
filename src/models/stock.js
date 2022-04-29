const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const dbconect = new Pool();

const getStocksAll = async () => {
  const query = "SELECT * FROM stock";
  const result = await dbconect.query(query);
  return result;
};

const getStockById = async (id) => {
  const query =
    "SELECT s.id ,p.name ,s.product_id ,s.size ,s.quantity ,s.price_unit ,s.created_at ,s.updated_at  FROM stock s INNER JOIN product p ON s.product_id = p.id WHERE s.id = $1";
  const result = await dbconect.query(query, [id]);
  if (!result.rows.length) {
    throw new NotFoundError("Stock Data By Id is not Found");
  }
  return result.rows[0];
};

const postStock = async (body) => {
  const id = `stock-${nanoid(16)}`;
  const { product_id, size, quantity, price_unit } = body;
  const created_at = new Date().toISOString();
  const updated_at = created_at;
  const query = "INSERT INTO stock VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id";

  const result = await dbconect.query(query, [
    id,
    product_id,
    size,
    quantity,
    price_unit,
    created_at,
    updated_at,
  ]);

  if (!result.rows.length) {
    throw new InvariantError("failed to add data");
  }
  return result.rows[0].id;
};

const putStock = async (id, body) => {
  const { size, quantity, price_unit, product_id } = body;
  const updated_at = new Date().toISOString();
  const haveSize = size !== undefined ? "size='" + size + "'," : "";
  const havePrice_unit =
    price_unit !== undefined ? "price_unit='" + price_unit + "'," : "";
  const haveQuantity =
    quantity !== undefined ? "quantity='" + quantity + "'," : "";
  const haveProduct_id =
    product_id !== undefined ? "product_id='" + product_id + "'," : "";
  const query =
    "UPDATE stock SET " +
    haveSize +
    haveQuantity +
    havePrice_unit +
    haveProduct_id +
    " updated_at=$2 WHERE id=$1 RETURNING id";
  const result = await dbconect.query(query, [id, updated_at]);

  if (!result.rows.length) {
    throw new NotFoundError("failed to update data. Data not found");
  }
  return result.rows[0].id;
};

const putStockQuantity = async (id, quantity) => {
  const updated_at = new Date().toISOString();
  const query =
    "UPDATE stock SET quantity=$1, updated_at=$2 WHERE id=$3 RETURNING id";
  const result = await dbconect.query(query, [quantity, updated_at, id]);

  if (!result.rows.length) {
    throw new NotFoundError("failed to add data quantity");
  }
  return result.rows[0].id;
};

const deleteStockById = async (id) => {
  const query = "DELETE FROM stock WHERE id = $1 RETURNING id";
  const result = await dbconect.query(query, [id]);

  if (!result.rows.length) {
    throw new NotFoundError("failed to delete data. Data not found");
  }
  return result.rows[0].id;
};
const deleteStockByProduct = async (product) => {
  const query = "DELETE FROM stock WHERE product_id = $1 RETURNING id";
  const result = await dbconect.query(query, [product]);

  return result.rows;
};

module.exports = {
  getStockById,
  getStocksAll,
  postStock,
  putStock,
  deleteStockById,
  putStockQuantity,
  deleteStockByProduct,
};
