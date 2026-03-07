const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "dsnlu_db",
};

async function migrate() {
  const connection = await mysql.createConnection(dbConfig);
  console.log("Connected to database.");

  try {
    console.log("Dropping existing tables to ensure clean slate...");
    await connection.query("SET FOREIGN_KEY_CHECKS = 0");
    await connection.query("DROP TABLE IF EXISTS competition_gallery");
    await connection.query("DROP TABLE IF EXISTS competition_editions");
    await connection.query("DROP TABLE IF EXISTS competition_coordinators");
    await connection.query("DROP TABLE IF EXISTS competition_contacts");
    await connection.query("DROP TABLE IF EXISTS competition_registration");
    await connection.query("DROP TABLE IF EXISTS competition_timelines");
    await connection.query("DROP TABLE IF EXISTS competitions");
    await connection.query("SET FOREIGN_KEY_CHECKS = 1");

    // 1. Create Tables
    console.log("Creating tables...");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS competitions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        description TEXT,
        logo_url VARCHAR(255),
        hero_logo VARCHAR(255),
        is_active BOOLEAN DEFAULT 1,
        display_order INT DEFAULT 0,
        slug VARCHAR(100) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS competition_timelines (
        id INT AUTO_INCREMENT PRIMARY KEY,
        competition_id INT,
        timeline_event VARCHAR(255) NOT NULL,
        timeline_date VARCHAR(255) NOT NULL,
        display_order INT DEFAULT 0,
        FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS competition_registration (
        id INT AUTO_INCREMENT PRIMARY KEY,
        competition_id INT,
        provisional_start VARCHAR(255),
        provisional_end VARCHAR(255),
        final_start VARCHAR(255),
        final_end VARCHAR(255),
        registration_fee VARCHAR(100),
        register_link VARCHAR(255),
        capacity VARCHAR(255),
        brochure_link VARCHAR(255),
        FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS competition_contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        competition_id INT,
        email VARCHAR(255),
        linkedin_link VARCHAR(255),
        instagram_link VARCHAR(255),
        faculty_name VARCHAR(255),
        faculty_phone VARCHAR(255),
        faculty_email VARCHAR(255),
        FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS competition_coordinators (
        id INT AUTO_INCREMENT PRIMARY KEY,
        competition_id INT,
        coordinator_name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        display_order INT DEFAULT 0,
        FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS competition_editions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        competition_id INT,
        edition_title VARCHAR(255) NOT NULL,
        edition_year VARCHAR(50),
        description TEXT,
        is_archived BOOLEAN DEFAULT 0,
        display_order INT DEFAULT 0,
        FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS competition_gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        edition_id INT,
        image_url VARCHAR(255) NOT NULL,
        display_order INT DEFAULT 0,
        FOREIGN KEY (edition_id) REFERENCES competition_editions(id) ON DELETE CASCADE
      )
    `);

    // 3. Insert NMC Data
    console.log("Seeding NMC data...");
    const [nmcResult] = await connection.query(`
      INSERT INTO competitions (title, description, logo_url, is_active, slug) 
      VALUES (
        'SHRI D. V. SUBBA RAO NATIONAL MEDIATION COMPETITION',
        "This competition is designed to provide law students with an immersive experience in mediation, a vital skill in the legal profession. Participants will engage in realistic mediation scenarios, helping them develop crucial negotiation and conflict resolution skills. The competition features seasoned judges and mediation experts from across the country, offering participants invaluable insights and feedback. This competition aims to foster and nurture a new generation of budding mediators and negotiators who will be well-equipped to handle the complexities of ADR.",
        'https://dsnlu.ac.in/storage/2026/01/logo.webp',
        1,
        'nmc'
      )
    `);
    const nmcId = nmcResult.insertId;

    // Timeline
    const timelines = [
      ['Provisional Registration Opens', '15 January 2026', 1],
      ['Provisional Registration Closes', '15 February 2026', 2],
      ['Final Registration Opens', '16 February 2026', 3],
      ['Final Registration Closes', '28 February 2026', 4],
      ['Competition Dates (TBA)', 'March 2026', 5]
    ];
    for (const t of timelines) {
      await connection.query("INSERT INTO competition_timelines (competition_id, timeline_event, timeline_date, display_order) VALUES (?, ?, ?, ?)", [nmcId, ...t]);
    }

    // Registration
    await connection.query(`
      INSERT INTO competition_registration (competition_id, provisional_start, provisional_end, final_start, final_end, registration_fee, capacity)
      VALUES (?, '15 Jan 2026', '15 Feb 2026', '16 Feb 2026', '28 Feb 2026', 'Rs. 9,000 /-', '32 Teams')
    `, [nmcId]);

    // Contacts
    await connection.query(`
      INSERT INTO competition_contacts (competition_id, email, linkedin_link, instagram_link, faculty_name, faculty_phone, faculty_email)
      VALUES (?, 'nationalmediation@dsnlu.ac.in', 'https://www.linkedin.com/company/damodaram-sanjivayya-national-mediation-competition/', 'https://www.instagram.com/dsnlu.nmc', 'Dr. Kavuri Sudha', '9492535618', 'sudhakavuri@dsnlu.ac.in')
    `, [nmcId]);

    // Coordinators
    const coordinators = [
      ['Arjit Mishra', 'Student Coordinator', 1],
      ['Kartikey Bansal', 'Student Coordinator', 2]
    ];
    for (const c of coordinators) {
      await connection.query("INSERT INTO competition_coordinators (competition_id, coordinator_name, role, display_order) VALUES (?, ?, ?, ?)", [nmcId, ...c]);
    }

    // Editions
    const [ed1] = await connection.query(`
      INSERT INTO competition_editions (competition_id, edition_title, edition_year, description, is_archived, display_order)
      VALUES (?, '1ST SHRI D. V. SUBBA RAO NATIONAL MEDIATION COMPETITION', '2024', 
      'The inaugural edition, held from 20th to 22nd September 2024, witnessed enthusiastic participation from 24 teams from across the country and was widely appreciated for its practical and immersive approach to mediation training.',
      1, 1)
    `, [nmcId]);

    const [ed2] = await connection.query(`
      INSERT INTO competition_editions (competition_id, edition_title, edition_year, description, is_archived, display_order)
      VALUES (?, '2ND SHRI D. V. SUBBA RAO NATIONAL MEDIATION COMPETITION', '2025–26', 
      "Get ready for the second edition of DSNLU's flagship mediation competition. Building on the success of our inaugural event, we aim to scale higher with a more diverse judge panel and globally-touched problem scenarios.",
      0, 2)
    `, [nmcId]);

    // Gallery for 1st Edition
    for (let i = 1; i <= 8; i++) {
      await connection.query("INSERT INTO competition_gallery (edition_id, image_url, display_order) VALUES (?, ?, ?)", [
        ed1.insertId,
        `https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800&index=${i}`,
        i
      ]);
    }

    // Gallery for 2nd Edition (Placeholder)
    for (let i = 1; i <= 8; i++) {
        await connection.query("INSERT INTO competition_gallery (edition_id, image_url, display_order) VALUES (?, ?, ?)", [
          ed2.insertId,
          `https://images.unsplash.com/photo-1521791136064-7986c2959210?auto=format&fit=crop&q=80&w=800&index=${i}`,
          i
        ]);
      }

    console.log("Migration completed successfully 🚀");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await connection.end();
  }
}

migrate();
function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
