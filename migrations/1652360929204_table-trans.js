/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("transaction", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    user_id: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    coupon: {
      type: "TEXT",
    },
    delivery_cost: {
      type: "VARCHAR(255)",
    },
    tax: {
      type: "VARCHAR(100)",
    },
    created_at: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    updated_at: {
      type: "VARCHAR(100)",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("transaction");
};
