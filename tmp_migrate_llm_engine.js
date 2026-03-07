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
    // 1. Drop existing LLM tables for clean start
    console.log('Cleaning up existing LLM tables...');
    await connection.query('DROP TABLE IF EXISTS llm_specialization_papers');
    await connection.query('DROP TABLE IF EXISTS llm_specializations');
    await connection.query('DROP TABLE IF EXISTS llm_dissertation');
    await connection.query('DROP TABLE IF EXISTS llm_compulsory_papers');
    await connection.query('DROP TABLE IF EXISTS llm_regulations');

    // 2. Create Tables
    console.log('Creating LLM tables...');
    
    await connection.query(`
      CREATE TABLE llm_regulations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        regulation_year VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE llm_compulsory_papers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        regulation_id INT NOT NULL,
        paper_id VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        credits INT NOT NULL,
        display_order INT DEFAULT 0,
        FOREIGN KEY (regulation_id) REFERENCES llm_regulations(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE llm_dissertation (
        id INT AUTO_INCREMENT PRIMARY KEY,
        regulation_id INT NOT NULL,
        name VARCHAR(255) DEFAULT 'Dissertation',
        credits INT DEFAULT 3,
        description TEXT,
        FOREIGN KEY (regulation_id) REFERENCES llm_regulations(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE llm_specializations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        regulation_id INT NOT NULL,
        spec_id VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        display_order INT DEFAULT 0,
        FOREIGN KEY (regulation_id) REFERENCES llm_regulations(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE llm_specialization_papers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        specialization_id INT NOT NULL,
        paper_id VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        credits INT DEFAULT 2,
        display_order INT DEFAULT 0,
        FOREIGN KEY (specialization_id) REFERENCES llm_specializations(id) ON DELETE CASCADE
      )
    `);

    // 3. Seed Data for 2023-24
    console.log('Seeding 2023-24 data...');
    const [regResult] = await connection.execute(
      'INSERT INTO llm_regulations (regulation_year) VALUES (?)',
      ['2023-24']
    );
    const regId = regResult.insertId;

    // Compulsory Papers
    const compulsory = [
      ['Paper-I', 'Research Methods and Legal Writing', 3, 1],
      ['Paper-II', 'Comparative Public Law/Systems of Governance', 3, 2],
      ['Paper-III', 'Law and Justice in a Globalizing World', 3, 3]
    ];
    for (const p of compulsory) {
      await connection.execute(
        'INSERT INTO llm_compulsory_papers (regulation_id, paper_id, name, credits, display_order) VALUES (?, ?, ?, ?, ?)',
        [regId, ...p]
      );
    }

    // Dissertation
    await connection.execute(
      'INSERT INTO llm_dissertation (regulation_id, name, credits, description) VALUES (?, ?, ?, ?)',
      [regId, 'Dissertation', 3, '150 marks for written submissions and 50 marks for Viva-Voce. The subject will be allotted by the University.']
    );

    // Specializations
    const specs = [
      ['corporate', 'Corporate and Commercial Law', 1, [
        ['Paper-IV', 'Law on Securities and Financial Markets', 2, 1],
        ['Paper-V', 'Commercial Arbitration', 2, 2],
        ['Paper-VI', 'International Investment Law', 2, 3],
        ['Paper-VII', 'Cyber Law', 2, 4],
        ['Paper-VIII', 'Bankruptcy Law', 2, 5],
        ['Paper-IX', 'Infrastructure Law', 2, 6]
      ]],
      ['constitutional', 'Constitutional Law and Administrative Law', 2, [
        ['Paper-IV', 'Fundamental Rights and Directive Principles of State Policy', 2, 1],
        ['Paper-V', 'Global Administrative Law', 2, 2],
        ['Paper-VI', 'Centre-State Relations and Constitutional Governance', 2, 3],
        ['Paper-VII', 'Police and Security Administration', 2, 4],
        ['Paper-VIII', 'Media and Telecommunications Law', 2, 5],
        ['Paper-IX', 'Health Law', 2, 6]
      ]],
      ['criminal', 'Criminal and Security Law', 3, [
        ['Paper-IV', 'International Criminal Law', 2, 1],
        ['Paper-V', 'Criminal Justice Administration and Critical Criminal Law', 2, 2],
        ['Paper-VI', 'National Security and Regional Co-operation', 2, 3],
        ['Paper-VII', 'Criminal Justice and Human Rights', 2, 4],
        ['Paper-VIII', 'Victimology and Sentencing Policy', 2, 5],
        ['Paper-IX', 'Corporate Crimes', 2, 6]
      ]]
    ];

    for (const [s_id, title, ord, papers] of specs) {
      const [sResult] = await connection.execute(
        'INSERT INTO llm_specializations (regulation_id, spec_id, title, display_order) VALUES (?, ?, ?, ?)',
        [regId, s_id, title, ord]
      );
      const specId = sResult.insertId;
      for (const p of papers) {
        await connection.execute(
          'INSERT INTO llm_specialization_papers (specialization_id, paper_id, name, credits, display_order) VALUES (?, ?, ?, ?, ?)',
          [specId, ...p]
        );
      }
    }

    console.log('LLM Migration successfully completed.');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await connection.end();
  }
}

migrate();
