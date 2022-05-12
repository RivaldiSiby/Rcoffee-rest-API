/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("promos", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    discount: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    description: {
      type: "TEXT",
      notNull: true,
    },
    coupon: {
      type: "TEXT",
      notNull: true,
    },
    product_id: {
      type: "VARCHAR(100)",
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
  pgm.dropTable("promos");
};
