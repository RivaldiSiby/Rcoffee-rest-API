const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const ClientError = require("../exceptions/ClientError");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const dbconect = new Pool();

const getProducts = async (req) => {
  try {
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
      valueSort = valueSort.toLowerCase() === "price" ? "price" : valueSort;
      valueOrder = valueOrder.toLowerCase() === "asc" ? "ASC" : "DESC";
      querySort = "ORDER BY " + valueSort + " " + valueOrder;
    }
    const querySQL =
      "SELECT p.id, p.name ,p.category, p.description, p.img, p.created_at, s.size, s.quantity, s.price FROM product p INNER JOIN stock s ON p.id  = s.product_id $1 $2 ";
    // const fixSQL = querySQL + queryFilter + querySort;
    // console.log(querySQL, queryFilter, querySort);
    const tes = "tes";
    const result = await dbconect.query(querySQL, [tes, querySort]);
    if (!result.rows.length) {
      throw new NotFoundError("Data is Not Found");
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

const getProductById = async (id) => {
  try {
    const query =
      "SELECT p.id, p.name ,p.category, p.description, p.img, p.created_at, p.updated_at, s.size, s.quantity, s.price FROM product p LEFT JOIN stock s ON p.id  = s.product_id WHERE p.id = $1 ORDER BY price DESC";
    const result = await dbconect.query(query, [id]);
    if (!result.rows.length) {
      throw new NotFoundError("Product Data By Id is Not Found");
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
const getJustProductById = async (id) => {
  try {
    const query = "SELECT * FROM product WHERE id = $1";
    const result = await dbconect.query(query, [id]);
    if (!result.rows.length) {
      throw new NotFoundError("Product Data By Id is Not Found");
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

const postProduct = async (body) => {
  try {
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
  } catch (error) {
    if (error instanceof ClientError) {
      return response.isError(res, error.statusCode, error.message);
    }
    if (error instanceof NotFoundError) {
      throw new NotFoundError(error.message);
    }
    if (error instanceof ClientError) {
      throw new NotFoundError(error.message);
    }
    throw new Error(error.message);
  }
};

const patchProduct = async (id, body) => {
  try {
    const { name, description, category, img } = body;
    const updated_at = new Date().toISOString();

    const query =
      "UPDATE product SET name=$1, category=$2, description=$3, img=$4, updated_at=$5 WHERE id=$6 RETURNING id";
    const result = await dbconect.query(query, [
      name,
      description,
      category,
      img,
      updated_at,
      id,
    ]);
    if (!result.rows.length) {
      throw new NotFoundError("failed to update data. Data not found");
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

const deleteProductById = async (id) => {
  try {
    const query = "DELETE FROM product WHERE id = $1 RETURNING id";
    const result = await dbconect.query(query, [id]);
    if (!result.rows.length) {
      throw new NotFoundError("failed to delete data. Data not found");
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

module.exports = {
  getProductById,
  postProduct,
  patchProduct,
  deleteProductById,
  getJustProductById,
  getProducts,
};
