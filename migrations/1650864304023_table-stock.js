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
      type: "VARCHAR(50)",
      notNull: true,
    },
    price_unit: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    created_at: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    updated_at: {
      type: "VARCHAR(255)",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("stock");
};
