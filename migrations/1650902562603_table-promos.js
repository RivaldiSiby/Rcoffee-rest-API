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
  pgm.dropTable("promos");
};
