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

async function seedVisitingDetails() {
  const pool = mysql.createPool(dbConfig);
  try {
    console.log("Starting Visiting Faculty Detailed seeding process...");

    // ==========================================
    // 1. Prof. (Dr.) A. Raghunadha Reddy
    // ==========================================
    console.log("Updating Prof. (Dr.) A. Raghunadha Reddy...");
    
    const arrSlug = "a-raghunadha-reddy";
    const [arrRes] = await pool.query("SELECT id FROM faculties WHERE slug = ?", [arrSlug]);
    if (arrRes.length > 0) {
      const arrId = arrRes[0].id;
      
      const arrBio = `Prof. (Dr.) A. Raghunadha Reddy is an esteemed HOD & DEAN with over 37 years of total teaching experience (5 years UG and 32 years PG). He was enrolled as an Advocate on 31.12.1981 on the Rolls of the Bar Council of A.P., Hyderabad. 

He holds a Ph.D. on 'Freedom of the Press' from M.D. University Rohtak (Haryana). Under his guidance, 7 scholars produced Ph.D. in Law at TNDALU, with 8 more ongoing. He was pivotal as the Editor-in-Chief of the 'Ambedkar Law University Journal' (ALUJ), helping produce 90 Ph.Ds during his stewardship. He completed several Major and Minor Research Projects from the UGC on subjects ranging from the 'Press', 'Monopoly and New Economic Policy', to 'Legal Reforms'.

His memberships in academic and research bodies are vast, including being a Life Member of the Indian Law Institute, member of the Commonwealth Legal Education Association (UK), member of the Asian Society of International Law (ASLI), and an expert member for UGC - NAAC. He has served as a Syndicate Member, Academic Senate Member, and In-Charge/Acting Vice Chancellor for TNDALU.

He has actively participated in Teacher Training Programmes at NLSIU Bangalore, Academic Staff College Tirupati, and institutions across the country and is a renowned Resource Person, having delivered lectures at institutions like VIT, SRM University, University of Kerala, Gonzaga Law School (USA), and multiple Academic Staff Colleges.`;

      await pool.query(
        "UPDATE faculties SET designation = ?, areas_of_interest = ?, bio_html = ? WHERE id = ?",
        ["HOD & DEAN", "Commercial Law, Corporate Law, Constitutional Law, Judicial Process, International Law", arrBio, arrId]
      );
      
      await pool.query("DELETE FROM faculty_experience WHERE faculty_id = ?", [arrId]);
      await pool.query("DELETE FROM faculty_publications WHERE faculty_id = ?", [arrId]);
      await pool.query("DELETE FROM faculty_conferences WHERE faculty_id = ?", [arrId]);
      
      const arrExp = [
        ["Professor of Law", "Tamil Nadu Dr. Ambedkar Law University, Chennai", "May 2005 - Present", "teaching", 1],
        ["Assistant and Associate Professor of Law", "S.K.University, Anantapur", "July 1990 - May 2005", "teaching", 2],
        ["Lecturer", "A.C.Law College, Guntur, A.P.", "July 1985 - July 1990", "teaching", 3],
        ["Head, Department of Law", "SK.University, Anantapur (A.P)", "", "administrative", 4],
        ["Dean, School of Excellence in Law", "Tamil Nadu Dr. Ambedkar Law University, Chennai", "", "administrative", 5],
        ["Director, Research and Publications & HOD of International Law", "The Tamil Nadu Dr. Ambedkar Law University, Chennai", "Present", "administrative", 6],
        ["In-Charge/Acting Vice Chancellor", "TNDALU", "", "administrative", 7],
      ];
      for (const e of arrExp) {
        await pool.query("INSERT INTO faculty_experience (faculty_id, title, institution, period, type, display_order) VALUES (?, ?, ?, ?, ?, ?)", [arrId, ...e]);
      }
      
      const arrPubs = [
          ["book", "Law of Contracts (Course Writer)", "Annamalai University LLM Course", "", "", 1],
          ["book", "Legal Regulation of Economic Enterprise (Course Writer)", "Annamalai University LLM Course", "", "", 2],
          ["article", "Right to education and Judicial Response: A Perspective", "Supreme Court Journal", "1987", "Vol. 1", 3],
          ["article", "Justice Delayed is Justice Denied", "Supreme Court Journal", "1988", "Vol. 2", 4],
          ["article", "Judicial Uncertainty over the Quantum of Reservation", "Indian Bar Review", "1988", "Vol. 15 [3&4]", 5],
          ["article", "Free Legal Aid: Judicial Activism", "Supreme Court Journal", "1988", "Vol. 3", 6],
          ["article", "Slow Poison to Death Sentence", "Supreme Court Journal", "1989", "Vol. 2", 7],
          ["article", "Does Threat to Commit to Suicide Amount to Coercion", "Criminal Law Journal", "1989", "Vol. 8", 8],
          ["article", "Freedom of the Press-A Myth", "Indian Journal of Legal Studies", "1991", "Vol. XI", 9],
          ["article", "Law and Social Change: A Process of Interaction", "Indian Bar Review", "1992", "Vol. 3&4", 10],
          ["article", "Freedom of the Indian press at Stakes", "Lawyer", "1994", "Vol. 25", 11],
          ["article", "Consumer Protection and Consumer Movement in India", "Supreme Court Journal", "1994", "Vol. 2", 12],
          ["article", "Concentration Conundrum vis-a-vis Ludicrous Distributive Justice", "Delhi Law Review", "1996", "Vol. 25", 13],
          ["article", "Environmental Protection in India: legal Dimensions", "Indian Socio-legal Journal", "1997", "Vol. XXIII", 14],
          ["article", "Liability of the Government Hospitals for the breach of Right to Life", "All India Reporter", "1998", "SC [jour] 153", 15],
          ["article", "Life Insurance as a Measure of Social Security", "Supreme Court Journal", "1998", "", 16],
          ["article", "Economic Policy", "Indian Bar Review", "2001", "Vol. XXVIII [L]", 17],
          ["article", "Law Teaching Methods and Techniques - A Critique with Special Reference to India", "All India Reporter", "2001", "Vol. 45", 18],
          ["article", "Globalization", "Indian Bar Review", "2001", "Vol. XXVIII [4]", 19],
          ["article", "Market Driven Economy", "Indian Bar Review", "2002", "Vol. XXIX [2]", 20],
          ["article", "Legal Reforms: Towards Internal Unification", "Indian Bar Review", "2005", "Vol. XXXII [3&4]", 21],
          ["article", "Legal Reforms through Judicial Law Making", "JILI", "2005", "47 JILI", 22],
          ["article", "Reparation of the wrong", "ISIL", "2006", "Vol. 46, No. 4", 23],
          ["article", "Right to water", "CTC", "2006", "2006 [3] CTC", 24],
          ["article", "Role of morality in Law making", "JILI", "2007", "49 JILI", 25],
          ["article", "Book Review on Domestic Violence", "JILI", "2007", "49 JILI", 26],
          ["article", "Exclusion of Creamy layer sine Qua Non for Egalitarianism", "Kerala University Journal of Legal Studies", "2008", "Vol. III Parts 1&2", 27],
          ["article", "Jurimetrics", "Journal Name Not Provided", "", "", 28],
          ["article", "Common Heritage of Mankind: Need for International Legal Regime", "The Year Book of Legal Studies", "2009", "Vol. 31", 29],
          ["article", "Trial by Media-A Critique from Human Rights Angle", "Nyaya Deep (NALSA)", "2010", "Vol. XI", 30],
          ["article", "Inclusive Education and the RTE Act - Problems and Perspectives", "Journal Name Not Provided", "", "", 31],
          ["article", "Corporate Social Responsibility", "Madras Law Journal", "2011", "", 32],
          ["article", "Maritime Piracy", "Madras Law Journal", "2012", "", 33],
          ["article", "Child Trafficking a seminal dispose from Human Rights Angle", "Journal of Department of Legal Studies", "2013", "Vol. 35,36,37", 34],
          ["article", "Right to Free Legal Aid: Judicial Activism", "Journal of Department of Legal Studies", "2016", "International Seminar Proceedings", 35],
          ["article", "International Law and Human Rights Law in a Globalised World: A Critical Study", "The Majesty of Law, University of Karnataka", "2016", "", 36],
          ["article", "Transformative Globalization, Repressive Freedoms and Impressive International Response", "International Interdisciplinary Proceedings", "2017", "", 37],
          ["article", "Realization of women's Rights", "International Interdisciplinary Proceedings, CALSAR", "2019", "", 38]
      ];
      
      for (const p of arrPubs) {
        await pool.query("INSERT INTO faculty_publications (faculty_id, type, title, journal_book_name, year, details, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)", [arrId, ...p]);
      }
      
      const arrConf = [
        ["International Conference on Law Teaching Methods and Techniques", "Presented paper", "April 2000", "international", "speaker", 1],
        ["International Conference on Globalization, Colombo, Sri Lanka", "Presented paper", "December 2001", "international", "speaker", 2],
        ["Reparations at University of Windsor, Ontario, Canada", "Presented paper in absentia", "June 2003", "international", "speaker", 3],
        ["Asian Law Institute (ASLI) International Conference, Malaysia", "Presented paper", "May 2010", "international", "speaker", 4],
        ["International Conference, Beijing, China", "Presented paper", "2011", "international", "speaker", 5],
        ["International Symposium, Spokane, USA", "Participant", "March 2012", "international", "participant", 6],
        ["International Conference on Corporate Social Responsibility, London", "Presented paper", "September 2015", "international", "speaker", 7],
        ["International Conference, Singapore", "Presented paper", "July 2016", "international", "speaker", 8],
        ["Organized 15 Seminars/Conferences", "TNDALU at National/State/Regional level", "", "national", "organized", 9],
        ["Participated & Presented Around 70 Research Papers", "Various Seminars and Symposia", "", "national", "speaker", 10]
      ];
      for (const c of arrConf) {
        await pool.query("INSERT INTO faculty_conferences (faculty_id, title, details, date, type, role, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)", [arrId, ...c]);
      }
    }


    // ==========================================
    // 2. Prof. (Dr.) Reddivari Revathi
    // ==========================================
    console.log("Updating Prof. (Dr.) Reddivari Revathi...");
    const rrSlug = "reddivari-revathi";
    const [rrRes] = await pool.query("SELECT id FROM faculties WHERE slug = ?", [rrSlug]);
    if (rrRes.length > 0) {
      const rrId = rrRes[0].id;
      
      const rrBio = `Prof. (Dr.) Reddivari Revathi serves as Professor & HOD of Constitutional Law & Human Rights with a specialization in Constitutional Law and Women and Law (Ph.D). She has 21 years of teaching experience at both UG and PG levels.

Her administrative experience is rich, having served as a Former Syndicate Member, Senate Member, Director of Research & Publications, and HoD of Constitutional Law Department at TNDALU, Chennai. She was the Deputy Warden in 2010 and also functions as a Member of various Disciplinary Committees.

She has successfully completed a UGC sponsored Major Research Project on 'Assisted Reproductive Technology vis-à-vis Women’s Rights'. She has produced 4 Ph.Ds, and is currently guiding 6 more research scholars. Her academic contributions extend to being a member of the Board of Studies and Doctoral Committees for multiple universities including TNDALU, VIT Law School, Crescent Law School, Satyabhama Deemed University, Tiruvalluvar University, Vel Tech, VELS Law School, SRM Law School, and AMET University.

Prof. Revathi has delivered over 30 special lectures as a resource person in Refresher courses and Orientation programmes across different universities. She has attended and deeply engaged in over 40 seminars and conferences at the national and international levels.`;

      await pool.query(
        "UPDATE faculties SET designation = ?, areas_of_interest = ?, bio_html = ? WHERE id = ?",
        ["Professor HOD Constitutional Law & Human Rights", "Constitutional Law, Women and Law", rrBio, rrId]
      );
      
      await pool.query("DELETE FROM faculty_experience WHERE faculty_id = ?", [rrId]);
      await pool.query("DELETE FROM faculty_publications WHERE faculty_id = ?", [rrId]);
      await pool.query("DELETE FROM faculty_conferences WHERE faculty_id = ?", [rrId]);
      
      const rrExp = [
        ["Teaching Experience (UG & PG)", "", "21 years", "teaching", 1],
        ["Former Syndicate Member", "TNDALU", "", "administrative", 2],
        ["Senate Member", "TNDALU", "", "administrative", 3],
        ["Director, Research & Publications", "TNDALU", "", "administrative", 4],
        ["HoD, Constitutional Law Department", "TNDALU", "", "administrative", 5],
        ["Deputy Warden", "TNDALU", "2010", "administrative", 6]
      ];
      for (const e of rrExp) {
        await pool.query("INSERT INTO faculty_experience (faculty_id, title, institution, period, type, display_order) VALUES (?, ?, ?, ?, ?, ?)", [rrId, ...e]);
      }
      
      const rrPubs = [
          ["book", "Law Relating to Domestic Violence", "", "", "Authored Book", 1],
          ["article", "24 Articles published in legal Journals", "", "", "Published Articles", 2]
      ];
      for (const p of rrPubs) {
        await pool.query("INSERT INTO faculty_publications (faculty_id, type, title, journal_book_name, year, details, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)", [rrId, ...p]);
      }
      
      const rrConf = [
        ["ASLI Conference, Kaulalampur Malaysia", "Presented Paper", "May 25-26, 2010", "international", "speaker", 1],
        ["ADD-GASAT International Conference, Mauritius", "Mahathma Gandhi Institute", "April 17-19, 2014", "international", "speaker", 2],
        ["Attended 40 seminars/conferences", "Both at national and International level", "", "national", "participant", 3],
        ["30 Special Lectures", "Refresher courses & Orientation programmes as Resource Person", "", "national", "resource-person", 4]
      ];
      for (const c of rrConf) {
        await pool.query("INSERT INTO faculty_conferences (faculty_id, title, details, date, type, role, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)", [rrId, ...c]);
      }
    }

    console.log("Detailed Seeding Completed!");
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedVisitingDetails();
