const psql = require("pg");
const { Pool } = psql;

if (process.env.STATUS !== "production") {
  const db = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  module.exports = db;
} else {
  const db = new Pool({
    connectionString: process.env.HEROKU_POSTGRESQL_ONYX_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  module.exports = db;
}
