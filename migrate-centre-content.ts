import pool from './src/config/db';

async function run() {
  try {
    // 1. Ensure centres exist
    await pool.query(
      `INSERT INTO centres (id, name, slug, display_order)
       VALUES 
       (9, 'Centre for Environment & Sustainable Development', 'environment', 9),
       (10, 'Centre for Public Policy and Social Justice', 'public-policy', 10)
       ON DUPLICATE KEY UPDATE name=VALUES(name), slug=VALUES(slug);`
    );

    // 2. Create centre_content table
    await pool.query(
      `CREATE TABLE IF NOT EXISTS centre_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        centre_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        display_order INT DEFAULT 0,
        FOREIGN KEY (centre_id) REFERENCES centres(id) ON DELETE CASCADE
      )`
    );

    // 3. Create centre_brochures table
    await pool.query(
      `CREATE TABLE IF NOT EXISTS centre_brochures (
        id INT AUTO_INCREMENT PRIMARY KEY,
        centre_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        file_url VARCHAR(500) NOT NULL,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (centre_id) REFERENCES centres(id) ON DELETE CASCADE
      )`
    );

    // 4. Seed initial content for Environment (ID 9)
    const [envContent]: any = await pool.query('SELECT COUNT(*) as count FROM centre_content WHERE centre_id = 9');
    if (envContent[0].count === 0) {
      await pool.query(
        `INSERT INTO centre_content (centre_id, title, content, display_order) VALUES 
        (9, 'About the Centre', 'The objective of establishing the Center for Environment and Sustainable Development... (Initial Data)', 1),
        (9, 'Vision', 'To organize Conferences, Seminars and Symposium on environmental issues... (Initial Data)', 2)`
      );
      console.log('Seeded Environment Centre content.');
    }

    // 5. Seed initial content for Public Policy (ID 10)
    const [ppContent]: any = await pool.query('SELECT COUNT(*) as count FROM centre_content WHERE centre_id = 10');
    if (ppContent[0].count === 0) {
      await pool.query(
        `INSERT INTO centre_content (centre_id, title, content, display_order) VALUES 
        (10, 'About the Centre', 'Initial public policy content...', 1)`
      );
      console.log('Seeded Public Policy Centre content.');
    }

    console.log('Environment and Public Policy tables verified/created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

run();
