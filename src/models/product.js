const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const dbconect = new Pool();

const getProductsAll = async (sort = null, order = null) => {
  if (sort === "") {
    throw InvariantError("Sort key is not valid");
  }
  let query =
    "SELECT p.id, p.name ,p.category, p.description, p.img, p.created_at, s.size, s.quantity, s.price_unit FROM product p INNER JOIN stock s ON p.id  = s.product_id";
  query =
    sort === null && order === null
      ? query
      : query + ` ORDER BY ${sort} ${order}`;
  const result = await dbconect.query(query);
  return result.rows;
};

const getProductsByCategory = async (category) => {
  const query =
    "SELECT p.id, p.name ,p.category, p.description, p.img, p.created_at, s.size, s.quantity, s.price_unit FROM product p INNER JOIN stock s ON p.id  = s.product_id WHERE lower(category) LIKE lower('%' || $1 || '%')  ORDER BY price_unit DESC";
  const result = await dbconect.query(query, [category]);
  if (!result.rows.length) {
    throw new NotFoundError("Search Data By Category is Not Found");
  }
  return result.rows;
};

const getProducts = async (req) => {
  const { query } = req;
  const byCategory = Object.keys(query).find((item) => item === "category");
  const byName = Object.keys(query).find((item) => item === "name");
  const bySort = Object.keys(query).find((item) => item === "sort");
  const byOrder = Object.keys(query).find((item) => item === "order");

  let queryFilter = "";
  if (byName !== undefined && byCategory !== undefined) {
    queryFilter =
      "WHERE lower(" +
      byName +
      ") LIKE lower('%' || '" +
      query.name +
      "' || '%') AND lower(" +
      byCategory +
      ") LIKE lower('%' || '" +
      query.category +
      "' || '%') ";
  }
  if (byName !== undefined || byCategory !== undefined) {
    let filterkey = byName !== undefined ? "name" : "category";
    let filtervalue = query.name !== undefined ? query.name : query.category;
    queryFilter =
      "WHERE lower(" +
      filterkey +
      ") LIKE lower('%' || '" +
      filtervalue +
      "' || '%')   ";
  }
  let querySort = "";
  if (bySort !== undefined && byOrder !== undefined) {
    let valueSort = query.sort;
    let valueOrder = query.order;
    if (
      valueSort.toLowerCase() !== "time" &&
      valueSort.toLowerCase() !== "price"
    ) {
      throw new InvariantError("Value Sort is not valid");
    }
    if (
      valueOrder.toLowerCase() !== "asc" &&
      valueOrder.toLowerCase() !== "desc"
    ) {
      throw new InvariantError("Value Order is not valid");
    }

    valueSort = valueSort.toLowerCase() === "time" ? "created_at" : valueSort;
    valueSort = valueSort.toLowerCase() === "price" ? "price_unit" : valueSort;
    valueOrder = valueOrder.toLowerCase() === "asc" ? "ASC" : "DESC";
    querySort = "ORDER BY " + valueSort + " " + valueOrder;
  }
  const querySQL =
    "SELECT p.id, p.name ,p.category, p.description, p.img, p.created_at, s.size, s.quantity, s.price_unit FROM product p INNER JOIN stock s ON p.id  = s.product_id ";
  const fixSQL = querySQL + queryFilter + querySort;
  const result = await dbconect.query(fixSQL);
  if (!result.rows.length) {
    throw new NotFoundError("Data is Not Found");
  }
  return result.rows;
};

const getProductByName = async (name) => {
  const query =
    "SELECT p.id, p.name ,p.category, p.description, p.img, p.created_at, p.updated_at, s.size, s.quantity, s.price_unit FROM product p INNER JOIN stock s ON p.id  = s.product_id WHERE lower(name) LIKE lower('%' || $1 || '%')  ORDER BY price_unit DESC";
  const result = await dbconect.query(query, [name]);
  if (!result.rows.length) {
    throw new NotFoundError("Search Data By Name is Not Found");
  }
  return result.rows;
};

const getProductById = async (id) => {
  const query =
    "SELECT p.id, p.name ,p.category, p.description, p.img, p.created_at, p.updated_at, s.size, s.quantity, s.price_unit FROM product p INNER JOIN stock s ON p.id  = s.product_id WHERE p.id = $1 ORDER BY price_unit DESC";
  const result = await dbconect.query(query, [id]);

  return result.rows;
};
const getJustProductById = async (id) => {
  const query = "SELECT * FROM product WHERE id = $1";
  const result = await dbconect.query(query, [id]);
  if (!result.rows.length) {
    throw new NotFoundError("Product Data By Id is Not Found");
  }
  return result.rows[0];
};

const postProduct = async (body) => {
  const { name, description, category, img } = body;
  const id = `product-${nanoid(16)}`;
  const created_at = new Date().toISOString();
  const updated_at = created_at;
  const query =
    "INSERT INTO product VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id,name,category";

  const result = await dbconect.query(query, [
    id,
    name,
    category,
    description,
    img,
    created_at,
    updated_at,
  ]);

  if (!result.rows.length) {
    throw new InvariantError("failed to add data");
  }
  return result.rows[0];
};

const putProduct = async (id, body) => {
  const { name, description, category, img } = body;
  const updated_at = new Date().toISOString();
  const haveName = name !== undefined ? "name='" + name + "'," : "";
  const haveDescription =
    description !== undefined ? "description='" + description + "'," : "";
  const haveCategory =
    category !== undefined ? "category='" + category + "'," : "";
  const haveImg = img !== undefined ? "img='" + img + "'," : "";
  const query =
    "UPDATE product SET " +
    haveName +
    haveDescription +
    haveCategory +
    haveImg +
    " updated_at=$2 WHERE id=$1 RETURNING id";
  const result = await dbconect.query(query, [id, updated_at]);
  if (!result.rows.length) {
    throw new NotFoundError("failed to update data. Data not found");
  }
  return result.rows[0].id;
};

const deleteProductById = async (id) => {
  try {
    const query = "DELETE FROM product WHERE id = $1 RETURNING id";
    const result = await dbconect.query(query, [id]);
    if (!result.rows.length) {
      throw new NotFoundError("failed to delete data. Data not found");
    }
    return result.rows[0].id;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getProductById,
  getProductsAll,
  getProductsByCategory,
  postProduct,
  putProduct,
  deleteProductById,
  getProductByName,
  getJustProductById,
  getProducts,
};
