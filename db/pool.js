require('dotenv').config();
const { Pool }  = require('pg');

module.exports = new Pool({
  user: process.env.PGUSER,
  host: 'localhost',
  database: 'inventory_app',
  password: process.env.PGPASSWORD,
  port: 5432,
});

