import bcrypt from "bcrypt";
import mysql from "mysql2/promise";

async function createAdmin() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "your_mysql_password",
    database: "dsnlu_db",
  });

  const hashedPassword = await bcrypt.hash("Likhith@32", 10);

  console.log("Generated Hash:", hashedPassword);

  await connection.execute(
    "INSERT INTO admins (email, password) VALUES (?, ?)",
    ["admin@dsnlu.ac.in", hashedPassword]
  );

  console.log("Admin created successfully");
  process.exit();
}

createAdmin();
