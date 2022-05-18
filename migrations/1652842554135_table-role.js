/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("role", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    name: {
      type: "VARCHAR(255)",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("role");
};
