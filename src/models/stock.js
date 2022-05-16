const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const ClientError = require("../exceptions/ClientError");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const dbconect = new Pool();

const getStocksAll = async (query) => {
  try {
    const { page = 1, limit = 3 } = query;
    const offset = parseInt(page - 1) * Number(limit);
    const querySql = "SELECT * FROM stock LIMIT $1 OFFSET $2";
    const result = await dbconect.query(querySql, [limit, offset]);
    const data = {
      data: result.rows,
    };
    // data pagination
    const count = await dbconect.query("SELECT COUNT(*) AS total FROM stock");
    data.totalData = parseInt(count.rows[0]["total"]);
    data.totalPage = Math.ceil(data.totalData / parseInt(limit));
    return data;
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

const getStockById = async (id) => {
  try {
    const query =
      "SELECT s.id ,p.name ,s.product_id ,s.size ,s.quantity ,s.price ,s.created_at ,s.updated_at  FROM stock s INNER JOIN product p ON s.product_id = p.id WHERE s.id = $1";
    const result = await dbconect.query(query, [id]);
    if (!result.rows.length) {
      throw new NotFoundError("Stock Data By Id is not Found");
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

const postStock = async (body) => {
  try {
    const id = `stock-${nanoid(16)}`;
    const { product_id, size, quantity, price } = body;
    const created_at = new Date().toISOString();
    const updated_at = created_at;
    const query =
      "INSERT INTO stock VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id";

    const result = await dbconect.query(query, [
      id,
      product_id,
      size,
      quantity,
      price,
      created_at,
      updated_at,
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

const patchStock = async (id, body) => {
  try {
    const { size, quantity, price, product_id } = body;
    const updated_at = new Date().toISOString();

    const query =
      "UPDATE stock SET product_id=$1, size=$2, quantity=$3, price=$4, updated_at=$5 WHERE id=$6 RETURNING id";
    const result = await dbconect.query(query, [
      product_id,
      size,
      quantity,
      price,
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

const patchStockQuantity = async (id, quantity) => {
  try {
    const updated_at = new Date().toISOString();
    const query =
      "UPDATE stock SET quantity=$1, updated_at=$2 WHERE id=$3 RETURNING id";
    const result = await dbconect.query(query, [quantity, updated_at, id]);

    if (!result.rows.length) {
      throw new NotFoundError("failed to add data quantity");
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

const deleteStockById = async (id) => {
  try {
    const query = "DELETE FROM stock WHERE id = $1 RETURNING id";
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
const deleteStockByProduct = async (product) => {
  try {
    const query = "DELETE FROM stock WHERE product_id = $1 RETURNING id";
    const result = await dbconect.query(query, [product]);

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
  getStockById,
  getStocksAll,
  postStock,
  patchStock,
  deleteStockById,
  patchStockQuantity,
  deleteStockByProduct,
};
