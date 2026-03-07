import bcrypt from "bcrypt";
import pool from "./config/db";
import dotenv from "dotenv";

dotenv.config();

const seedAdmin = async () => {
  const email = "admin@dsnlu.ac.in";
  const password = "Likhith@32";
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // MySQL table creation
    const queries = [
      `CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS carousel_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image_url TEXT NOT NULL,
        title VARCHAR(255),
        subtitle VARCHAR(255),
        display_order INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        link TEXT,
        is_new TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS vice_chancellors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        designation VARCHAR(255),
        university VARCHAR(255),
        short_message TEXT,
        full_message TEXT,
        image_url TEXT,
        resume_url TEXT,
        start_date DATE,
        end_date DATE,
        is_current TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS visitors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        designation VARCHAR(255),
        university VARCHAR(255),
        title_tag VARCHAR(255),
        biography TEXT,
        image_url TEXT,
        resume_url TEXT,
        start_date DATE,
        end_date DATE,
        is_current TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`


    ];

    for (const query of queries) {
      await pool.query(query);
    }

    // Check and seed admin
    const [results]: any = await pool.query("SELECT * FROM admins WHERE email = ?", [email]);
    
    if (results.length === 0) {
      await pool.query(
        "INSERT INTO admins (email, password) VALUES (?, ?)",
        [email, hashedPassword]
      );
      console.log("Admin created successfully!");
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
    } else {
      console.log("Admin already exists.");
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
