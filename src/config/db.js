const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.HEROKU_POSTGRESQL_ONYX_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = client;
