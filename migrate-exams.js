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
      CREATE TABLE IF NOT EXISTS exam_results (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE,
        result_date VARCHAR(50),
        type ENUM('pdf', 'internal', 'url') NOT NULL,
        link VARCHAR(500),
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS exam_result_files (
        id INT AUTO_INCREMENT PRIMARY KEY,
        result_id INT,
        label VARCHAR(255) NOT NULL,
        file_url VARCHAR(500) NOT NULL,
        display_order INT DEFAULT 0,
        FOREIGN KEY (result_id) REFERENCES exam_results(id) ON DELETE CASCADE
      )
    `);

    console.log("Seeding exam results...");
    const results = [
      {
        title: "Ph.D. Course Work Examination Results – December, 2025",
        result_date: "24 Jan, 2026",
        type: 'pdf',
        link: "https://dsnlu.ac.in/storage/2026/01/Ph.D.-Course-Work-Examination-Results-December-2025.pdf",
        slug: "phd-dec-2025"
      },
      {
        title: "B.A.,LL.B End Semester Examination Results (Odd Semester), November – 2025",
        result_date: "11 Dec, 2025",
        type: 'internal',
        slug: "ba-llb-odd-semester-nov-2025",
        files: [
          { label: "B.A., LL.B. Semester-I", file_url: "https://dsnlu.ac.in/storage/2025/12/B.A.-LL.B.-Semester-I.pdf" },
          { label: "B.A., LL.B. Semester-III", file_url: "https://dsnlu.ac.in/storage/2025/12/B.A.-LL.B.-Semester-III.pdf" },
          { label: "B.A., LL.B. Semester-V", file_url: "https://dsnlu.ac.in/storage/2025/12/B.A.-LL.B.-Semester-V-1.pdf" },
          { label: "B.A., LL.B. Semester-VII", file_url: "https://dsnlu.ac.in/storage/2025/12/B.A.-LL.B.-Semester-VII-1.pdf" },
          { label: "B.A., LL.B. Semester-IX", file_url: "https://dsnlu.ac.in/storage/2025/12/B.A.-LL.B.-Semester-IX-1.pdf" },
        ]
      },
      {
        title: "3 Year LL.B End Semester Examination Results (Odd Semester), November – 2025",
        result_date: "10 Dec, 2025",
        type: 'internal',
        slug: "3-year-llb-odd-semester-nov-2025",
        files: [
          { label: "3 Year LL.B. Semester-I", file_url: "https://dsnlu.ac.in/storage/2025/12/3-Year-LL.B.-Semester-I-3.pdf" },
          { label: "3 Year LL.B. Semester-III", file_url: "https://dsnlu.ac.in/storage/2025/12/3-Year-LL.B.-Semester-III-3.pdf" },
        ]
      },
      {
        title: "B.A., LL.B. Even Semester Examination Revaluation Results (Semester-II, IV, VI, and VIII), April 2025",
        result_date: "25 Oct, 2025",
        type: 'internal',
        slug: "ba-llb-even-semester-revaluation-april-2025",
        files: [
          { label: "SEMESTER-II", file_url: "https://dsnlu.ac.in/storage/2025/10/SEMESTER-II.pdf" },
          { label: "SEMESTER-IV", file_url: "https://dsnlu.ac.in/storage/2025/10/SEMESTER-IV.pdf" },
          { label: "SEMESTER-VI", file_url: "https://dsnlu.ac.in/storage/2025/10/SEMESTER-VI.pdf" },
          { label: "SEMESTER-VIII", file_url: "https://dsnlu.ac.in/storage/2025/10/SEMESTER-VIII.pdf" },
        ]
      },
      {
        title: "LL.M. Even Semester Examination Results, July-August 2025",
        result_date: "21 Aug, 2025",
        type: 'pdf',
        link: "https://dsnlu.ac.in/storage/2025/08/LL.M.-Even-Semester-Result-July-August-2025.pdf",
        slug: "llm-even-2025"
      },
      {
        title: "3 Year LL.B. Odd Semester Examination Revaluation Results (Semester-I), February 2025",
        result_date: "08 Jul, 2025",
        type: 'pdf',
        link: "https://dsnlu.ac.in/storage/2025/07/3YLL.B.-Odd-Semester-Revaluation-Feb-2025.pdf",
        slug: "3llb-odd-reval-2025"
      },
      {
        title: "B.A., LL.B. Even Semester Examinations Revaluation Results (Semester-X), April 2025",
        result_date: "16 Jun, 2025",
        type: 'pdf',
        link: "https://dsnlu.ac.in/storage/2025/06/SEM-X-RV-April-2025.pdf",
        slug: "ballb-even-reval-x-2025"
      },
      {
        title: "Repeat Mid and End Semester Examination Results (Odd Semester), March – 2025",
        result_date: "10 May, 2025",
        type: 'pdf',
        link: "https://dsnlu.ac.in/storage/2025/05/Repeat-Mid-and-End-Semester-Results-Odd-Semester-March-2025.pdf",
        slug: "repeat-mid-end-2025"
      },
      {
        title: "B.A., LL.B. Odd Semester Examinations Results, November-2024",
        result_date: "12 Dec, 2024",
        type: 'url',
        link: "https://dsnlu.ac.in/all-examinations/b-a-ll-b-odd-semester-examinations-results-november-2024/",
        slug: "ballb-odd-nov-2024"
      }
    ];

    for (const res of results) {
      const [existing] = await connection.query("SELECT id FROM exam_results WHERE slug = ?", [res.slug]);
      if (existing.length === 0) {
        const [insertRes] = await connection.query(
          "INSERT INTO exam_results (title, slug, result_date, type, link) VALUES (?, ?, ?, ?, ?)",
          [res.title, res.slug, res.result_date, res.type, res.link || null]
        );
        
        const resultId = insertRes.insertId;
        
        if (res.files && res.files.length > 0) {
          for (const [index, file] of res.files.entries()) {
            await connection.query(
              "INSERT INTO exam_result_files (result_id, label, file_url, display_order) VALUES (?, ?, ?, ?)",
              [resultId, file.label, file.file_url, index + 1]
            );
          }
        }
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
