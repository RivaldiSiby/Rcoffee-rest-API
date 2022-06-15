const { nanoid } = require("nanoid");

const { Pool } = require("pg");
const ClientError = require("../exceptions/ClientError");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");

const db = require("../config/db");

const getJustProduct = async () => {
  try {
    const query = "SELECT id,name FROM product";
    const result = await db.query(query);
    if (!result.rows.length) {
      throw new NotFoundError(`Data is Not Found`);
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
const getFavoriteProducts = async (query) => {
  try {
    const byCategory = Object.keys(query).find((item) => item === "category");
    const byName = Object.keys(query).find((item) => item === "name");

    let querySQL = {
      text: "select p.id, s.id AS stock_id, p.name ,p.category, p.description, p.img, p.created_at, s.size, s.quantity, s.price, SUM(ss.quantity)as sold FROM sales ss LEFT JOIN stock s ON ss.stock_id = s.id LEFT JOIN product p ON s.product_id = p.id GROUP BY p.id,s.id ORDER BY sold desc",
      values: [],
    };

    // ketika difilter dengan nama dan catagory
    if (byName !== undefined && byCategory !== undefined) {
      querySQL = {
        text: "SELECT p.id, s.id AS stock_id, p.name ,p.category, p.description, p.img, p.created_at, s.size, s.quantity, s.price, SUM(ss.quantity)as penjualan FROM sales ss LEFT JOIN stock s ON ss.stock_id = s.id LEFT JOIN product p ON s.product_id = p.id WHERE lower(name) LIKE lower('%' || $1 || '%') AND lower(category) LIKE lower('%' || $2 || '%') GROUP BY p.id,s.id ORDER BY penjualan desc",
        values: [query.name, query.category],
      };
    }
    // ketika difilter dengan nama  atau catagory
    if (byName !== undefined || byCategory !== undefined) {
      let filterkey = byName !== undefined ? "name" : "category";
      let filtervalue = query.name !== undefined ? query.name : query.category;
      if (filterkey === "name") {
        // pengecekan order by desc / asc
        querySQL = {
          text: "SELECT p.id, s.id AS stock_id, p.name ,p.category, p.description, p.img, p.created_at, s.size, s.quantity, s.price, SUM(ss.quantity)as penjualan FROM sales ss LEFT JOIN stock s ON ss.stock_id = s.id LEFT JOIN product p ON s.product_id = p.id WHERE lower(name) LIKE lower('%' || $1 || '%') GROUP BY p.id,s.id ORDER BY penjualan desc",
          values: [filtervalue],
        };
      } else {
        querySQL = {
          text: "SELECT p.id, s.id AS stock_id, p.name ,p.category, p.description, p.img, p.created_at, s.size, s.quantity, s.price, SUM(ss.quantity)as penjualan FROM sales ss LEFT JOIN stock s ON ss.stock_id = s.id LEFT JOIN product p ON s.product_id = p.id WHERE category = $1 GROUP BY p.id,s.id ORDER BY penjualan desc",
          values: [filtervalue],
        };
      }
    }
    const resultCount = await db.query(querySQL);
    // pagination
    const { page = 1, limit = 3 } = query;
    const offset = parseInt(page - 1) * Number(limit);
    const val = querySQL.values.length;
    querySQL.text += ` LIMIT $${val + 1} OFFSET $${val + 2}`;
    querySQL.values.push(limit, offset);

    const result = await db.query(querySQL);
    if (!result.rows.length) {
      throw new NotFoundError(`Data is Not Found`);
    }

    result.rows.map((item) => {
      path = item.img.split("\\");
      item.img = `/${path[1]}/${path[2]}/${path[3]}`;
    });
    const data = {
      data: result.rows,
    };

    // data pagination
    data.totalData = parseInt(resultCount.rowCount);
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
const getProducts = async (query) => {
  try {
    const byCategory = Object.keys(query).find((item) => item === "category");
    const byName = Object.keys(query).find((item) => item === "name");
    const bySort = Object.keys(query).find((item) => item === "sort");
    const byOrder = Object.keys(query).find((item) => item === "order");

    let querySQL = {
      text: "SELECT p.id,  s.id AS stock_id, p.name ,p.category, p.description, p.img, p.created_at, s.size, s.quantity, s.price FROM product p INNER JOIN stock s ON s.product_id = p.id ",
      values: [],
    };

    // ketika difilter dengan nama dan catagory
    if (byName !== undefined && byCategory !== undefined) {
      querySQL = {
        text: "SELECT p.id, s.id AS stock_id, p.name ,p.category, p.description, p.img, p.created_at, s.size, s.quantity, s.price FROM product p INNER JOIN stock s ON s.product_id = p.id WHERE lower(name) LIKE lower('%' || $1 || '%') AND lower(category) LIKE lower('%' || $2 || '%') ",
        values: [query.name, query.category],
      };
    }
    // ketika difilter dengan nama  atau catagory
    if (byName !== undefined || byCategory !== undefined) {
      let filterkey = byName !== undefined ? "name" : "category";
      let filtervalue = query.name !== undefined ? query.name : query.category;
      if (filterkey === "name") {
        // pengecekan order by desc / asc
        querySQL = {
          text: "SELECT p.id, s.id AS stock_id, p.name ,p.category, p.description, p.img, p.created_at, s.size, s.quantity, s.price FROM product p INNER JOIN stock s ON s.product_id = p.id WHERE lower(name) LIKE lower('%' || $1 || '%')",
          values: [filtervalue],
        };
      } else {
        querySQL = {
          text: "SELECT p.id, s.id AS stock_id, p.name ,p.category, p.description, p.img, p.created_at, s.size, s.quantity, s.price FROM product p INNER JOIN stock s ON s.product_id = p.id WHERE category = $1",
          values: [filtervalue],
        };
      }
    }

    // mengambil data sort dan order
    let sort = "id";
    let order = "ASC";
    if (bySort !== undefined && byOrder !== undefined) {
      // cek isi query sortir
      if (query.sort !== "time" && query.sort !== "price") {
        throw new InvariantError("Value Sort is not valid");
      }
      sort = query.sort === "time" ? "created_at" : sort;
      sort = query.sort === "price" ? "price" : sort;
      order = query.order === "desc" ? "DESC" : "ASC";

      querySQL.text += " ORDER BY " + sort + " " + order;
    }
    const resultCount = await db.query(querySQL);
    // pagination
    const { page = 1, limit = 3 } = query;
    const offset = parseInt(page - 1) * Number(limit);
    const val = querySQL.values.length;
    querySQL.text += ` LIMIT $${val + 1} OFFSET $${val + 2}`;
    querySQL.values.push(limit, offset);

    const result = await db.query(querySQL);
    if (!result.rows.length) {
      throw new NotFoundError(`Data is Not Found`);
    }

    result.rows.map((item) => {
      path = item.img.split("\\");
      item.img = `/${path[1]}/${path[2]}/${path[3]}`;
    });
    const data = {
      data: result.rows,
    };

    // data pagination
    data.totalData = parseInt(resultCount.rowCount);
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

const getProductById = async (id) => {
  try {
    const query =
      "SELECT p.id, s.id AS stock_id, p.name ,p.category, p.description, p.img, p.created_at, s.size, s.quantity, s.price FROM product p INNER JOIN stock s ON s.product_id = p.id WHERE p.id = $1 ORDER BY price DESC";
    const result = await db.query(query, [id]);
    if (!result.rows.length) {
      throw new NotFoundError("Product Data By Id is Not Found");
    }

    result.rows.map((item) => {
      const path = item.img.split("\\");
      item.img = `/${path[1]}/${path[2]}/${path[3]}`;
    });
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
    const result = await db.query(query, [id]);
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

    const result = await db.query(query, [
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
    const result = await db.query(query, [
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
    const query = "DELETE FROM product WHERE id = $1 RETURNING img";
    const result = await db.query(query, [id]);
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

module.exports = {
  getProductById,
  postProduct,
  patchProduct,
  deleteProductById,
  getJustProductById,
  getProducts,
  getFavoriteProducts,
  getJustProduct,
};
