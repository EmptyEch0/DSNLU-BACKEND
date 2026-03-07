import pool from './src/config/db';

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS centre_boards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        centre_id INT,
        role VARCHAR(255),
        name VARCHAR(255),
        designation TEXT,
        email VARCHAR(255),
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table centre_boards created or already exists.');

    const initialMembers = [
      ['Chief Patron', 'Hon’ble Sri Justice P. Narasimha', 'Judge, Supreme Court of India, Visitor, DSNLU', null, 1],
      ['Patron', 'Hon’ble Sri Justice Dhiraj Singh Thakur', 'Chief Justice, High Court of Andhra Pradesh, Chancellor, DSNLU', null, 2],
      ['Honorary Editor', 'Prof. (Dr.) D. Surya Prakasa Rao', 'Vice-Chancellor, DSNLU', null, 3],
      ['Chief Editor', 'Dr. Dayananda Murthy C.P', 'Associate Professor & Chair Person, CIPR', 'dmurthy@dsnlu.ac.in', 4],
      ['Advisory Board', 'Prof. (Dr.) V.C. Vivekananda', null, null, 5],
      ['Advisory Board', 'Prof. (Dr.) V.K. Ahuja', null, null, 6],
      ['Advisory Board', 'Prof. (Dr.) T. Ramakrishna', null, null, 7],
      ['Advisory Board', 'Prof. (Dr.) Irene Calboli', null, null, 8],
      ['Editorial Board', 'Dr. Ragini P Khubalkar', null, null, 9],
      ['Editorial Board', 'Prof. (Dr.) G.B. Reddy', null, null, 10],
      ['Editorial Board', 'Prof. (Dr.) Subhash Chandra Roy', null, null, 11]
    ];

    const [existing]: any = await pool.query('SELECT COUNT(*) as count FROM centre_boards WHERE centre_id = 5');
    if (existing[0].count === 0) {
      for (const [role, name, desig, email, ord] of initialMembers) {
        await pool.query(
          'INSERT INTO centre_boards (centre_id, role, name, designation, email, display_order) VALUES (5, ?, ?, ?, ?, ?)',
          [role, name, desig, email, ord]
        );
      }
      console.log('Seeded CIPR board members.');
    } else {
      console.log('CIPR board members already seeded.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

run();
