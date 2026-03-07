import pool from './src/config/db';

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS centre_committees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        centre_id INT,
        role VARCHAR(255),
        name VARCHAR(255),
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table centre_committees created or already exists.');

    const initialMembers = [
      ['Honorary Chair Person', 'Dr. Dayananda Murthy C.P.', 1],
      ['Faculty Members', 'Dr. P. Jogi Naidu', 2],
      ['Faculty Members', 'Dr. B. Neelima', 3],
      ['Faculty Members', 'Ms. Sherley Hepsiba D', 4],
      ['Faculty Members', 'Dr. Kiran Kumari', 5]
    ];

    const [existing]: any = await pool.query('SELECT COUNT(*) as count FROM centre_committees WHERE centre_id = 5');
    if (existing[0].count === 0) {
      for (const [role, name, ord] of initialMembers) {
        await pool.query('INSERT INTO centre_committees (centre_id, role, name, display_order) VALUES (5, ?, ?, ?)', [role, name, ord]);
      }
      console.log('Seeded CIPR committee members.');
    } else {
      console.log('CIPR committee members already seeded.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

run();
