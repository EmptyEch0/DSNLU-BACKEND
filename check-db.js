const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const [tables] = await pool.query('SHOW TABLES');
    console.log('Available Tables:', tables.map(t => Object.values(t)[0]));

    const [faculties] = await pool.query('SELECT * FROM faculties');
    console.log('Faculties in DB:', faculties.map(f => ({ name: f.name, slug: f.slug })));

    if (faculties.length > 0) {
        const facultyId = faculties[0].id;
        const [exp] = await pool.query('SELECT * FROM faculty_experience WHERE faculty_id = ?', [facultyId]);
        console.log(`Experience records for faculty ${facultyId}:`, exp.length);
    }

    pool.end();
  } catch (err) {
    console.error('DB Check Failed:', err);
    process.exit(1);
  }
}

check();
