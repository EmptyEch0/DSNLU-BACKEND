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
    // 1. Create Tables
    console.log('Creating Centres tables...');
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS centres (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS centre_committee_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        centre_id INT NOT NULL,
        role VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        designation VARCHAR(255),
        display_order INT DEFAULT 0,
        FOREIGN KEY (centre_id) REFERENCES centres(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS centre_publications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        centre_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        pdf_url VARCHAR(255),
        is_published BOOLEAN DEFAULT FALSE,
        display_order INT DEFAULT 0,
        FOREIGN KEY (centre_id) REFERENCES centres(id) ON DELETE CASCADE
      )
    `);

    // 2. Seed CADR Data (Idempotent)
    console.log('Seeding CADR data...');
    
    // Check if CADR exists
    const [existing] = await connection.execute('SELECT id FROM centres WHERE slug = ?', ['cadr']);
    let centreId;
    if (existing.length > 0) {
      centreId = existing[0].id;
      console.log('CADR centre already exists. Updating...');
      await connection.execute(
        'UPDATE centres SET name=?, description=? WHERE id=?',
        ['Centre for Alternative Dispute Resolution', 'The Centre for Alternative Dispute Resolution (CADR) at DSNLU aims to promote awareness and research in the field of ADR.', centreId]
      );
    } else {
      const [centreResult] = await connection.execute(
        'INSERT INTO centres (name, slug, description) VALUES (?, ?, ?)',
        ['Centre for Alternative Dispute Resolution', 'cadr', 'The Centre for Alternative Dispute Resolution (CADR) at DSNLU aims to promote awareness and research in the field of ADR.']
      );
      centreId = centreResult.insertId;
    }

    // Committee Members (Clean and Re-seed for simplicity in dev)
    await connection.execute('DELETE FROM centre_committee_members WHERE centre_id = ?', [centreId]);
    const committee = [
      ['Honorary Chair Person', 'Dr. P. Jogi Naidu', 'Registrar, DSNLU', 1],
      ['Faculty Member', 'Dr. N. Bhagyalakshmi', 'Assistant Professor of Law', 2],
      ['Faculty Member', 'Mr. A. Manmadha Rao', 'Assistant Professor of Law', 3],
      ['Student Member', 'Ms. S. Kavya', 'IV Year BALLB', 4],
      ['Student Member', 'Mr. V. Sai Krishna', 'IV Year BALLB', 5],
    ];
    for (const [role, name, designation, ord] of committee) {
      await connection.execute(
        'INSERT INTO centre_committee_members (centre_id, role, name, designation, display_order) VALUES (?, ?, ?, ?, ?)',
        [centreId, role, name, designation, ord]
      );
    }

    // Publications (Clean and Re-seed)
    await connection.execute('DELETE FROM centre_publications WHERE centre_id = ?', [centreId]);
    const publications = [
      ['JALAF Volume 1, Issue 1', 'The Arbitration Journal of DSNLU', 'uploads/jalaf_v1_i1.pdf', true, 1],
      ['CADR Newsletter', 'Inaugural Edition', 'uploads/cadr_newsletter.pdf', false, 2],
    ];
    for (const [title, sub, url, pub, ord] of publications) {
      await connection.execute(
        'INSERT INTO centre_publications (centre_id, title, subtitle, pdf_url, is_published, display_order) VALUES (?, ?, ?, ?, ?, ?)',
        [centreId, title, sub, url, pub, ord]
      );
    }

    console.log('Centres Migration successfully completed.');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await connection.end();
  }
}

migrate();
