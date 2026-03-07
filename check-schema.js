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

async function checkSchema() {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [rows] = await connection.query("DESCRIBE faculties");
    console.log("FACULTIES_SCHEMA:" + JSON.stringify(rows));
    
    try {
        const [catRows] = await connection.query("DESCRIBE faculty_categories");
        console.log("CATEGORIES_SCHEMA:" + JSON.stringify(catRows));
    } catch(e) {
        console.log("CATEGORIES_NOT_FOUND");
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSchema();
