/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    name: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    email: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    password: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    phone: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    date_birth: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    gender: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    address: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    role: {
      type: "VARCHAR(255)",
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
  pgm.dropTable("users");
};
