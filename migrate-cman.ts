import pool from './src/config/db';

async function run() {
  try {
    // 1. Ensure 'cman' centre exists with ID 8
    const [existing]: any = await pool.query("SELECT id FROM centres WHERE slug = 'cman' OR id = 8");
    if (existing.length === 0) {
      await pool.query("INSERT INTO centres (id, name, slug, display_order) VALUES (8, 'Centre for Maritime, Admiralty & Navigation Laws (C-MAN)', 'cman', 9)");
      console.log('Inserted C-MAN centre with ID 8');
    } else {
      console.log('C-MAN centre or ID 8 already exists');
    }

    // 2. Create centre_student_members table if missing
    await pool.query(`
      CREATE TABLE IF NOT EXISTS centre_student_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        centre_id INT,
        name VARCHAR(255) NOT NULL,
        year_label VARCHAR(50),
        category VARCHAR(50),
        display_order INT DEFAULT 0,
        FOREIGN KEY (centre_id) REFERENCES centres(id) ON DELETE CASCADE
      )
    `);
    console.log('Ensured centre_student_members table exists.');

    // 3. Seed initial committee data
    const initialCommittee = [
      ['Honorary Chair Person', 'Dr. P. Jogi Naidu', 1],
      ['Faculty Member', 'Dr. Ch. Lakshmi', 2],
      ['Members', 'Mr. Abhishek Sinha', 3],
      ['Members', 'Dr. Arvind Nath Tripathi', 4]
    ];

    const [existingCommittee]: any = await pool.query('SELECT COUNT(*) as count FROM centre_committees WHERE centre_id = 8');
    if (existingCommittee[0].count === 0) {
      for (const [role, name, ord] of initialCommittee) {
        await pool.query('INSERT INTO centre_committees (centre_id, role, name, display_order) VALUES (8, ?, ?, ?)', [role, name, ord]);
      }
      console.log('Seeded C-MAN committee members.');
    } else {
      console.log('C-MAN committee members already seeded.');
    }

    // 4. Seed initial student members
    const initialStudents = [
      { name: 'Rishi Raj', year: 'IV Year', category: 'convenor', ord: 1 },
      { name: 'Sumangala Bhargava', year: 'IV Year', category: 'co-convenor', ord: 2 },
      { name: 'Member 1', year: 'V Year', category: 'student_member', ord: 3 },
      { name: 'Member 2', year: 'V Year', category: 'student_member', ord: 4 },
      { name: 'Member 1', year: 'IV Year', category: 'student_member', ord: 5 },
      { name: 'Member 2', year: 'IV Year', category: 'student_member', ord: 6 },
      { name: 'Member 3', year: 'IV Year', category: 'student_member', ord: 7 },
      { name: 'Member 1', year: 'III Year', category: 'student_member', ord: 8 },
      { name: 'Member 2', year: 'III Year', category: 'student_member', ord: 9 },
      { name: 'Member 1', year: 'II Year', category: 'student_member', ord: 10 },
      { name: 'Member 2', year: 'II Year', category: 'student_member', ord: 11 },
      { name: 'Member 3', year: 'II Year', category: 'student_member', ord: 12 },
      { name: 'Member 1', year: 'II Year (3 Year LL.B)', category: 'student_member', ord: 13 },
      { name: 'Member 2', year: 'II Year (3 Year LL.B)', category: 'student_member', ord: 14 }
    ];

    const [existingStudents]: any = await pool.query('SELECT COUNT(*) as count FROM centre_student_members WHERE centre_id = 8');
    if (existingStudents[0].count === 0) {
      for (const s of initialStudents) {
        await pool.query('INSERT INTO centre_student_members (centre_id, name, year_label, category, display_order) VALUES (8, ?, ?, ?, ?)', [s.name, s.year, s.category, s.ord]);
      }
      console.log('Seeded C-MAN student members.');
    } else {
      console.log('C-MAN student members already seeded.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

run();
