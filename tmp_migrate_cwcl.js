const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  console.log('Connected to database.');

  try {
    // 1. Create New Tables for Centres Expansion
    console.log('Creating CWCL-related tables...');
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS centre_events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        centre_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        event_date DATE,
        description TEXT,
        guidance TEXT,
        display_order INT DEFAULT 0,
        FOREIGN KEY (centre_id) REFERENCES centres(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS centre_event_gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        centre_id INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        display_order INT DEFAULT 0,
        FOREIGN KEY (centre_id) REFERENCES centres(id) ON DELETE CASCADE
      )
    `);

    // 2. Seed CWCL Metadata
    console.log('Seeding CWCL data...');
    const [existing] = await connection.execute('SELECT id FROM centres WHERE slug = ?', ['cwcl']);
    let centreId;
    if (existing.length > 0) {
      centreId = existing[0].id;
      console.log('CWCL centre already exists. Updating...');
      await connection.execute(
        'UPDATE centres SET name=?, description=? WHERE id=?',
        ['Centre for Child and Woman Law', 'The Centre for Child and Woman Law (CWCL) at DSNLU is dedicated to the protection and promotion of rights for children and women through legal research and advocacy.', centreId]
      );
    } else {
      const [centreResult] = await connection.execute(
        'INSERT INTO centres (name, slug, description) VALUES (?, ?, ?)',
        ['Centre for Child and Woman Law', 'cwcl', 'The Centre for Child and Woman Law (CWCL) at DSNLU is dedicated to the protection and promotion of rights for children and women through legal research and advocacy.']
      );
      centreId = centreResult.insertId;
    }

    // 3. Seed Committee Members for CWCL
    await connection.execute('DELETE FROM centre_committee_members WHERE centre_id = ?', [centreId]);
    const committee = [
      ['Honorary Chair Person', 'Prof. (Dr.) D. Surya Prakasa Rao', 'Vice-Chancellor, DSNLU', 1],
      ['Director', 'Dr. P. Sree Sudha', 'Associate Professor of Law', 2],
      ['Faculty Member', 'Mrs. B. Neelima', 'Assistant Professor of Law', 3],
      ['Student Coordinator', 'Ms. T. Shreya', 'V Year BALLB', 4],
    ];
    for (const [role, name, designation, ord] of committee) {
      await connection.execute(
        'INSERT INTO centre_committee_members (centre_id, role, name, designation, display_order) VALUES (?, ?, ?, ?, ?)',
        [centreId, role, name, designation, ord]
      );
    }

    // 4. Seed Events for CWCL
    await connection.execute('DELETE FROM centre_events WHERE centre_id = ?', [centreId]);
    const events = [
      ['Webinar on Rights of Girl Child', '2024-01-24', 'A national webinar discussing the legal protections for the girl child in India.', 'Register via the link provided in the brochure.', 1],
      ['Workshop on POCSO Act', '2023-11-20', 'Practical workshop for law students on the implementation of the POCSO Act.', 'Limited seats available.', 2],
    ];
    for (const [title, date, desc, guide, ord] of events) {
      await connection.execute(
        'INSERT INTO centre_events (centre_id, title, event_date, description, guidance, display_order) VALUES (?, ?, ?, ?, ?, ?)',
        [centreId, title, date, desc, guide, ord]
      );
    }

    // 5. Seed Gallery for CWCL
    await connection.execute('DELETE FROM centre_event_gallery WHERE centre_id = ?', [centreId]);
    const gallery = [
      ['https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80', 1],
      ['https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80', 2],
      ['https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80', 3],
    ];
    for (const [url, ord] of gallery) {
      await connection.execute(
        'INSERT INTO centre_event_gallery (centre_id, image_url, display_order) VALUES (?, ?, ?)',
        [centreId, url, ord]
      );
    }

    console.log('CWCL Migration successfully completed.');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await connection.end();
  }
}

migrate();
