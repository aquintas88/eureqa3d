'use strict';

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')
    ? { rejectUnauthorized: false }
    : false,
  options: '-c search_path=eureqa3d'
});

pool.on('error', (err) => console.error('PostgreSQL pool error:', err));

const db = {
  query: (text, params) => pool.query(text, params),
  pool
};

/* Verify connection on startup */
pool.query('SELECT current_schema()')
  .then(r => console.log(`🗄️  PostgreSQL conectado → schema: ${r.rows[0].current_schema}`))
  .catch(err => {
    console.error('❌ No se pudo conectar a PostgreSQL:', err.message);
    process.exit(1);
  });

module.exports = db;
