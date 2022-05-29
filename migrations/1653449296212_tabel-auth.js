/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("auth", {
    id: {
      type: "VARCHAR(100)",
      primaryKey: true,
    },
    token: {
      type: "TEXT",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("auth");
};
