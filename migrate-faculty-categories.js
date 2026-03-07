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
    console.log("Checking faculty_categories table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS faculty_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        display_order INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Add category_id if not exists
    console.log("Adding category_id to faculties...");
    const [cols] = await connection.query("SHOW COLUMNS FROM faculties LIKE 'category_id'");
    if (cols.length === 0) {
      await connection.query("ALTER TABLE faculties ADD COLUMN category_id INT AFTER id");
    }

    // Add display_order and is_active to faculties if not exist
    const [doCols] = await connection.query("SHOW COLUMNS FROM faculties LIKE 'display_order'");
    if (doCols.length === 0) {
      await connection.query("ALTER TABLE faculties ADD COLUMN display_order INT DEFAULT 0");
    }
    const [iaCols] = await connection.query("SHOW COLUMNS FROM faculties LIKE 'is_active'");
    if (iaCols.length === 0) {
      await connection.query("ALTER TABLE faculties ADD COLUMN is_active TINYINT(1) DEFAULT 1");
    }

    // Insert Default Categories
    const categories = [
      { title: "Hon’ble Vice-Chancellor", slug: "vc", display_order: 1 },
      { title: "Regular Faculty", slug: "regular", display_order: 2 },
      { title: "Faculty – 5 Year Contract", slug: "contract", display_order: 3 },
      { title: "Adhoc Faculty", slug: "adhoc", display_order: 4 },
      { title: "Visiting Faculty", slug: "visiting", display_order: 5 }
    ];

    for (const cat of categories) {
      const [existing] = await connection.query("SELECT id FROM faculty_categories WHERE slug = ?", [cat.slug]);
      if (existing.length === 0) {
        await connection.query("INSERT INTO faculty_categories (title, slug, display_order) VALUES (?, ?, ?)", [cat.title, cat.slug, cat.display_order]);
      } else {
        await connection.query("UPDATE faculty_categories SET title = ?, display_order = ? WHERE slug = ?", [cat.title, cat.display_order, cat.slug]);
      }
    }

    // Update faculties category_id based on old category string or slug
    console.log("Migrating faculty data to categories...");
    
    // Helper to map
    const [catMapRows] = await connection.query("SELECT id, slug FROM faculty_categories");
    const catMap = {};
    catMapRows.forEach(r => catMap[r.slug] = r.id);

    // Map existing faculties
    // Prof. D. Surya Prakasa Rao -> VC
    await connection.query("UPDATE faculties SET category_id = ? WHERE slug = ?", [catMap['vc'], 'd-surya-prakasa-rao']);
    
    // Map those with 'visiting' string in category (if I used that before)
    await connection.query("UPDATE faculties SET category_id = ? WHERE category = ?", [catMap['visiting'], 'visiting']);

    // For others, we might need to look at Faculty.tsx to see who belongs where
    // But since I'm going to update them anyway, I'll set defaults for common names I know
    
    const regularFacNames = ["nandini-cp", "dayananda-murthy-cp", "p-jogi-naidu", "r-bharat-kumar", "soma-battacharjya", "n-bhagya-lakshmi", "ch-lakshmi", "a-nageswara-rao", "rifat-khan", "viswachandra-nath-madasu", "abhishek-sinha", "deepthi-r", "neelima-boghadi", "sherley-hepsiba-dokiburra", "arvind-nath-tripathi", "d-aparna", "gali-parivarthana", "s-kiran-kumari"];
    for (const slug of regularFacNames) {
        await connection.query("UPDATE faculties SET category_id = ? WHERE slug = ?", [catMap['regular'], slug]);
    }
    
    const contractFacNames = ["k-sudha", "v-sunitha", "paramata-bhuvaneswari", "durga-prasad-inturu"];
    for (const slug of contractFacNames) {
        await connection.query("UPDATE faculties SET category_id = ? WHERE slug = ?", [catMap['contract'], slug]);
    }
    
    const adhocFacNames = ["bhavani-prasad-panda", "b-surekha-reddy", "rv-vishnu-kumar", "ty-nirmala-devi", "rv-prasad", "sarita-rani-chukka"];
    for (const slug of adhocFacNames) {
        await connection.query("UPDATE faculties SET category_id = ? WHERE slug = ?", [catMap['adhoc'], slug]);
    }

    console.log("Migration successful!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrate();
