const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const ClientError = require("../exceptions/ClientError");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const dbconect = new Pool();
const getPromosAll = async (query) => {
  try {
    // pagination
    const { page = 1, limit = 3 } = query;
    const offset = parseInt(page - 1) * Number(limit);
    const querySql = "SELECT * FROM promos LIMIT $1 OFFSET $2";
    const result = await dbconect.query(querySql, [limit, offset]);
    const data = {
      data: result.rows,
    };
    // data pagination
    const count = await dbconect.query("SELECT COUNT(*) AS total FROM promos");
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

const getPromosById = async (id) => {
  try {
    const query = "SELECT * FROM promos WHERE id=$1";
    const result = await dbconect.query(query, [id]);

    if (!result.rows.length) {
      throw new NotFoundError("Data not Found");
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
const getPromosByCoupon = async (coupon) => {
  try {
    const query = "SELECT * FROM promos WHERE coupon=$1";
    const result = await dbconect.query(query, [coupon]);

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
const postPromos = async (body) => {
  try {
    const id = `discount-${nanoid(16)}`;
    const { discount, description, coupon, product_id } = body;
    const created_at = new Date().toISOString();
    const updated_at = created_at;
    const query =
      "INSERT INTO promos VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id";
    const result = await dbconect.query(query, [
      id,
      discount,
      description,
      coupon,
      product_id,
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

const patchPromosById = async (id, body) => {
  try {
    const { discount, description, coupon, product_id } = body;
    const updated_at = new Date().toISOString();
    const query =
      "UPDATE promos SET discount=$1, description=$2, coupon=$3, product_id=$4, updated_at=$5 WHERE id=$6 RETURNING id";
    const result = await dbconect.query(query, [
      discount,
      description,
      coupon,
      product_id,
      updated_at,
      id,
    ]);

    if (!result.rows.length) {
      throw new NotFoundError("failed to update data. Data not Found");
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

const deletePromosById = async (id) => {
  try {
    const query = "DELETE FROM promos WHERE id = $1 RETURNING id";
    const result = await dbconect.query(query, [id]);

    if (!result.rows.length) {
      throw new NotFoundError("failed to delete data. Data not Found");
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
  getPromosAll,
  getPromosById,
  postPromos,
  patchPromosById,
  deletePromosById,
  getPromosByCoupon,
};
