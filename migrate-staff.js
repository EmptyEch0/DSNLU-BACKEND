const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "dsnlu",
  port: parseInt(process.env.DB_PORT || "3306"),
};

async function migrate() {
  const connection = await mysql.createConnection(dbConfig);
  try {
    console.log("Creating tables...");
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS staff_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        icon VARCHAR(50) DEFAULT 'Briefcase',
        display_order INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS staff (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        designation VARCHAR(255) NOT NULL,
        image_url VARCHAR(255),
        category_id INT,
        display_order INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES staff_categories(id) ON DELETE SET NULL
      )
    `);

    console.log("Seeding categories...");
    const categories = [
      { title: "University Officers", slug: "university-officers", icon: "ShieldCheck", display_order: 1 },
      { title: "Administrative Staff", slug: "administrative-staff", icon: "Briefcase", display_order: 2 },
      { title: "Library Staff", slug: "library-staff", icon: "UserCircle", display_order: 3 },
      { title: "Technical & Support Staff", slug: "support-staff", icon: "Headphones", display_order: 4 }
    ];

    for (const cat of categories) {
      const [existing] = await connection.query("SELECT id FROM staff_categories WHERE slug = ?", [cat.slug]);
      if (existing.length === 0) {
        await connection.query(
          "INSERT INTO staff_categories (title, slug, icon, display_order) VALUES (?, ?, ?, ?)",
          [cat.title, cat.slug, cat.icon, cat.display_order]
        );
      }
    }

    // Map categorization
    const [catRows] = await connection.query("SELECT id, slug FROM staff_categories");
    const catMap = {};
    catRows.forEach(r => catMap[r.slug] = r.id);

    console.log("Seeding staff members...");
    const staffData = [
      // Officers
      { name: "Dr. Viswachandra Nath Madasu", designation: "Registrar-In Charge", image_url: "https://dsnlu.ac.in/storage/2024/08/Dr.-Viswachandra-Nath-M-.png", cat: "university-officers" },
      { name: "C.Venkateswarlu", designation: "Finance Officer", image_url: "https://dsnlu.ac.in/storage/2022/12/user-placeholder.png", cat: "university-officers" },
      { name: "Dr. P. Jogi Naidu", designation: "Controller of Examinations (I/c)", image_url: "https://dsnlu.ac.in/storage/2022/12/Mr.-Jogi-Naidu-2.jpg", cat: "university-officers" },
      
      // Admin
      { name: "Mr. K. Santosh Kumar", designation: "Assistant Registrar", image_url: "https://dsnlu.ac.in/storage/2022/12/user-placeholder.png", cat: "administrative-staff" },
      { name: "Mr. B. Prasada Rao", designation: "Section Officer", image_url: "https://dsnlu.ac.in/storage/2022/12/user-placeholder.png", cat: "administrative-staff" },
      { name: "Ms. V. Lavanya", designation: "Section Officer", image_url: "https://dsnlu.ac.in/storage/2022/12/user-placeholder.png", cat: "administrative-staff" },
      { name: "Mr. S. Rajesh", designation: "Assistant", image_url: "https://dsnlu.ac.in/storage/2022/12/user-placeholder.png", cat: "administrative-staff" },
      { name: "Mr. P. Rambabu", designation: "Assistant", image_url: "https://dsnlu.ac.in/storage/2022/12/user-placeholder.png", cat: "administrative-staff" },
      { name: "Ms. K. Satyawathi", designation: "Junior Assistant", image_url: "https://dsnlu.ac.in/storage/2022/12/user-placeholder.png", cat: "administrative-staff" },
      
      // Library
      { name: "Mr. B. Srinivasa Rao", designation: "Assistant Librarian", image_url: "https://dsnlu.ac.in/storage/2022/12/user-placeholder.png", cat: "library-staff" },
      { name: "Mr. D. Simhachalam", designation: "Library Assistant", image_url: "https://dsnlu.ac.in/storage/2022/12/user-placeholder.png", cat: "library-staff" },
      
      // Support
      { name: "Mr. G. Apparao", designation: "System Administrator", image_url: "https://dsnlu.ac.in/storage/2022/12/user-placeholder.png", cat: "support-staff" },
      { name: "Mr. K. Vinay", designation: "Office Assistant", image_url: "https://dsnlu.ac.in/storage/2022/12/user-placeholder.png", cat: "support-staff" },
      { name: "Mr. P. Satish", designation: "Driver", image_url: "https://dsnlu.ac.in/storage/2022/12/user-placeholder.png", cat: "support-staff" }
    ];

    for (const [index, member] of staffData.entries()) {
      const [existing] = await connection.query("SELECT id FROM staff WHERE name = ? AND category_id = ?", [member.name, catMap[member.cat]]);
      if (existing.length === 0) {
        await connection.query(
          "INSERT INTO staff (name, designation, image_url, category_id, display_order) VALUES (?, ?, ?, ?, ?)",
          [member.name, member.designation, member.image_url, catMap[member.cat], index + 1]
        );
      }
    }

    console.log("Migration successful!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrate();
