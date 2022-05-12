/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("product", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    name: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    category: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    description: {
      type: "TEXT",
      notNull: true,
    },
    img: {
      type: "TEXT",
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
  pgm.dropTable("product");
};
