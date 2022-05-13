/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("stock", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    product_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    size: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    quantity: {
      type: "INTEGER",
      notNull: true,
    },
    price: {
      type: "INTEGER",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("stock");
};
