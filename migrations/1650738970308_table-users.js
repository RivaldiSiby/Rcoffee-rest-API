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
    first_name: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    last_name: {
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
    img: {
      type: "TEXT",
      default: null,
    },
    role: {
      type: "VARCHAR(255)",
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
  pgm.dropTable("users");
};
