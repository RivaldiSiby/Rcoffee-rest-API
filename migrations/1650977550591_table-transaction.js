/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("transaction", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    quantity_items: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    costumer: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    coupen: {
      type: "TEXT",
    },
    price: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    delivery_cost: {
      type: "VARCHAR(255)",
    },
    tax: {
      type: "VARCHAR(100)",
    },
    total: {
      type: "VARCHAR(255)",
      notNull: true,
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
