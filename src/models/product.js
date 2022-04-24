const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const dbconect = new Pool();

const getProductsAll = async () => {
  const query = "SELECT * FROM product";
  const result = await dbconect.query(query);
  return result;
};

const getProductsByCategory = async (category) => {
  const query =
    "SELECT * FROM product WHERE lower(category) LIKE lower('%' || $1 || '%')  ORDER BY name ASC";
  const result = await dbconect.query(query, [category]);
  if (!result.rows.length) {
    throw new NotFoundError("Search Data By Category is Not Found");
  }
  return result;
};

const getProductByName = async (name) => {
  const query =
    "SELECT * FROM product WHERE lower(name) LIKE lower('%' || $1 || '%') ";
  const result = await dbconect.query(query, [name]);
  if (!result.rows.length) {
    throw new NotFoundError("Search Data By Name is Not Found");
  }
  return result.rows[0];
};

const getProductById = async (id) => {
  const query = "SELECT * FROM product WHERE id= $1";
  const result = await dbconect.query(query, [id]);
  if (!result.rows.length) {
    throw new NotFoundError("Data is Not Found");
  }
  return result.rows[0];
};

const postProduct = async (body) => {
  const { name, description, category } = body;
  const id = `product-${nanoid(16)}`;
  const created_at = new Date().toISOString();
  const updated_at = created_at;
  const query =
    "INSERT INTO product VALUES ($1,$2,$3,$4,$5,$6) RETURNING id,name,category";

  const result = await dbconect.query(query, [
    id,
    name,
    category,
    description,
    created_at,
    updated_at,
  ]);

  if (!result.rows.length) {
    throw new InvariantError("failed to add data");
  }
  return result.rows[0];
};

const putProduct = async (id, body) => {
  const { name, description, category } = body;
  const updated_at = new Date().toISOString();
  const query =
    "UPDATE product SET name=$1, category=$2, description=$3, updated_at=$4 WHERE id=$5 RETURNING id ";
  const result = await dbconect.query(query, [
    name,
    category,
    description,
    updated_at,
    id,
  ]);
  if (!result.rows.length) {
    throw new NotFoundError("failed to update data. Data not found");
  }
  return result.rows[0].id;
};

const deleteProductById = async (id) => {
  const query = "DELETE FROM product WHERE id = $1 RETURNING id";
  const result = await dbconect.query(query, [id]);
  if (!result.rows.length) {
    throw new NotFoundError("failed to delete data. Data not found");
  }
  return result.rows[0].id;
};

module.exports = {
  getProductById,
  getProductsAll,
  getProductsByCategory,
  postProduct,
  putProduct,
  deleteProductById,
  getProductByName,
};
