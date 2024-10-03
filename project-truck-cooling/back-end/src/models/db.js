const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Proyek3',
  password: 'irinn1601',
  port: 5432,
});

module.exports = pool;