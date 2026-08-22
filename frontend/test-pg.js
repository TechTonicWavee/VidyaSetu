require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT 1', (err, res) => {
  if (err) console.error("Error:", err);
  else console.log("Success:", res.rows);
  pool.end();
});
