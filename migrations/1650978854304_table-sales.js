/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("sales", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    product_id: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    stock_id: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    transaction_id: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    discount: {
      type: "VARCHAR(100)",
    },
    quantity: {
      type: "INTEGER",
      notNull: true,
    },
    total: {
      type: "INTEGER",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("sales");
};
