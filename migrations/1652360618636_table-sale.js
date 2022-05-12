/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("sales", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    stock_id: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    transaction_id: {
      type: "VARCHAR(100)",
      notNull: true,
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
