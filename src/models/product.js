const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const dbconect = new Pool();

const getProductsAll = async () => {
  const query =
    "SELECT p.id, p.name ,p.category, p.description, p.img, p.created_at, s.size, s.quantity, s.price_unit FROM product p INNER JOIN stock s ON p.id  = s.product_id ORDER BY price_unit DESC;";
  const result = await dbconect.query(query);
  const isNotHaveStock = await dbconect.query("SELECT * FROM product ");
  let checkdata = [];
  // mencari dan mengecek data yang belum memiliki stock
  isNotHaveStock.rows.map((data) => {
    let havestock = 0;
    result.rows.map((item) => {
      if (data.name !== item.name) {
        havestock += 1;
      }
    });
    if (havestock === result.rowCount) {
      checkdata.push(data);
    }
  });

  if (checkdata.length > 0) {
    let fixdata = [];
    checkdata.map((item) => {
      const stock = { size: "", quantity: "0", price_unit: "0" };
      fixdata.push({ ...item, ...stock });
    });
    const alldata = result.rows;
    alldata.push(...fixdata);
    return alldata;
  }
  return result.rows;
};

const getProductsByCategory = async (category) => {
  const query =
    "SELECT p.id, p.name ,p.category, p.description, p.img, p.created_at, s.size, s.quantity, s.price_unit FROM product p INNER JOIN stock s ON p.id  = s.product_id WHERE lower(category) LIKE lower('%' || $1 || '%')  ORDER BY price_unit DESC";
  const result = await dbconect.query(query, [category]);
  if (!result.rows.length) {
    throw new NotFoundError("Search Data By Category is Not Found");
  }
  // cek apakah ada data yang tidak mempunyai stock
  const isNotHaveStock = await dbconect.query(
    "SELECT * FROM product WHERE lower(category) LIKE lower('%' || $1 || '%')  ",
    [category]
  );
  let checkdata = [];

  isNotHaveStock.rows.map((data) => {
    let havestock = 0;
    result.rows.map((item) => {
      if (data.name !== item.name) {
        havestock += 1;
      }
    });
    if (havestock === result.rowCount) {
      checkdata.push(data);
    }
  });
  if (checkdata.length > 0) {
    let fixdata = [];
    checkdata.map((item) => {
      const stock = { size: "", quantity: "0", price_unit: "0" };
      fixdata.push({ ...item, ...stock });
    });
    const alldata = result.rows;
    alldata.push(...fixdata);
    return alldata.sort((a, b) => a.name - b.name);
  }
  return result.rows;
};

const getProductByName = async (name) => {
  const query =
    "SELECT p.id, p.name ,p.category, p.description, p.img, p.created_at, p.updated_at, s.size, s.quantity, s.price_unit FROM product p INNER JOIN stock s ON p.id  = s.product_id WHERE lower(name) LIKE lower('%' || $1 || '%')  ORDER BY price_unit DESC";
  const result = await dbconect.query(query, [name]);
  if (!result.rows.length) {
    const isNotHaveStock = await dbconect.query(
      "SELECT * FROM product WHERE lower(name) LIKE lower('%' || $1 || '%')  ",
      [name]
    );
    if (isNotHaveStock.rows.length > 0) {
      const stock = { size: "", quantity: 0, price_unit: 0 };
      const data = { ...isNotHaveStock.rows[0], ...stock };
      return data;
    }
    throw new NotFoundError("Search Data By Name is Not Found");
  }
  return result.rows;
};

const getProductById = async (id) => {
  console.log(id);
  // const query = "SELECT * FROM product WHERE id= $1";
  // const result = await dbconect.query(query, [id]);
  // if (!result.rows.length) {
  //   throw new NotFoundError("Data is Not Found");
  // }
  // return result.rows[0];
  const query =
    "SELECT p.id, p.name ,p.category, p.description, p.img, p.created_at, p.updated_at, s.size, s.quantity, s.price_unit FROM product p INNER JOIN stock s ON p.id  = s.product_id WHERE p.id = $1 ORDER BY price_unit DESC";
  const result = await dbconect.query(query, [id]);
  if (!result.rows.length) {
    const isNotHaveStock = await dbconect.query(
      "SELECT * FROM product WHERE id = $1 ",
      [id]
    );
    if (isNotHaveStock.rows.length > 0) {
      const stock = { size: "", quantity: 0, price_unit: 0 };
      const data = { ...isNotHaveStock.rows[0], ...stock };
      return data;
    }
    throw new NotFoundError("Search Data By Name is Not Found");
  }
  return result.rows;
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
  const query =
    "UPDATE product SET name=$1, category=$2, description=$3, updated_at=$4 WHERE id=$5 RETURNING id ";
  const result = await dbconect.query(query, [
    name,
    category,
    img,
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
