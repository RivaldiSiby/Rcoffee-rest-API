const { Pool } = require("pg");

const db = new Pool({
  connectionString: process.env.HEROKU_POSTGRESQL_ONYX_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = db;
