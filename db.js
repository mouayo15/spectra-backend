const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'spectra',
  password: 'ayoub123***',
  port: 5432, // Port par défaut de PostgreSQL
});

module.exports = pool;
