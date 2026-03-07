const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "dsnlu_db",
});

async function run() {
  try {
    console.log('Creating faculty tables...');

    // 1. Core Faculty Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS faculties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        designation VARCHAR(255),
        image_url TEXT,
        phone VARCHAR(50),
        email VARCHAR(100),
        total_teaching_experience TEXT,
        prof_since TEXT,
        education_summary TEXT,
        present_position TEXT,
        bio_html LONGTEXT,
        areas_of_interest TEXT,
        display_order INT DEFAULT 0,
        category VARCHAR(50) DEFAULT 'regular'
      )
    `);

    // 2. Education Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS faculty_education (
        id INT AUTO_INCREMENT PRIMARY KEY,
        faculty_id INT,
        degree VARCHAR(255),
        institution VARCHAR(255),
        year VARCHAR(20),
        FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE
      )
    `);

    // 3. Experience Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS faculty_experience (
        id INT AUTO_INCREMENT PRIMARY KEY,
        faculty_id INT,
        title VARCHAR(255),
        institution VARCHAR(255),
        period VARCHAR(100),
        type ENUM('teaching', 'administrative', 'other') DEFAULT 'teaching',
        display_order INT DEFAULT 0,
        FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE
      )
    `);

    // 4. Awards Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS faculty_awards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        faculty_id INT,
        title TEXT,
        organization VARCHAR(255),
        year VARCHAR(20),
        FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE
      )
    `);

    // 5. Publications Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS faculty_publications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        faculty_id INT,
        type ENUM('book', 'article', 'journal', 'other') DEFAULT 'article',
        title TEXT,
        journal_book_name TEXT,
        year VARCHAR(20),
        details TEXT,
        display_order INT DEFAULT 0,
        FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE
      )
    `);

    // 6. Conferences Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS faculty_conferences (
        id INT AUTO_INCREMENT PRIMARY KEY,
        faculty_id INT,
        title TEXT,
        details TEXT,
        date VARCHAR(100),
        type ENUM('national', 'international') DEFAULT 'national',
        role VARCHAR(100),
        display_order INT DEFAULT 0,
        FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE
      )
    `);

    // 7. Research Meta (Projects, Guidance)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS faculty_research_meta (
        id INT AUTO_INCREMENT PRIMARY KEY,
        faculty_id INT,
        meta_key VARCHAR(255),
        meta_value TEXT,
        type ENUM('project', 'guidance', 'leadership', 'other') DEFAULT 'other',
        display_order INT DEFAULT 0,
        FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE
      )
    `);

    console.log('Seeding Prof. D. Surya Prakasa Rao...');

    // Delete existing VC record to allow clean re-seed
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['d-surya-prakasa-rao']);

    const [vcResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, present_position, total_teaching_experience, areas_of_interest, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Prof. (Dr.) D. Surya Prakasa Rao',
        'd-surya-prakasa-rao',
        'Hon\'ble Vice Chancellor',
        'https://dsnlu.ac.in/storage/2023/10/3-1-e1712994432753.jpeg',
        'B.Sc., LL.M., Ph.D in Law, JRF & NET- 1990',
        'Vice Chancellor, Damodaram Sanjivayya National Law University (DSNLU), Visakhapatnam. Honorary Professor, Former Chairman, Faculty of Law and Former Principal, Dr. B.R.Ambedkar College of Law, Andhra University Visakhapatnam.',
        '37 Years by March 31st 2023',
        'Jurisprudence, Constitutional law, Family Law, Human Rights, International Economic Laws including WTO and Intellectual Property Laws, Alternate Dispute Settlement Mechanism, Free Legal Aid and Legal Education, Economic Analysis of Law, Commercial Laws, Environmental Law.',
        'vc'
      ]
    );
    const vcId = vcResult.insertId;

    // Experience
    const experience = [
      ['Assistant Professor', 'Sir C.R Reddy Law College, Eluru', '02-04-1986 to 23-03-1994', 'teaching', 1],
      ['Assistant Professor', 'Department of Law, Andhra University', '24-03-1994 to 18-01-1999', 'teaching', 2],
      ['Associate Professor', 'Department of Law, Andhra University', '19-01-1999 to 18-01-2007', 'teaching', 3],
      ['Professor', 'Department of Law, Andhra University', '19-01-2007 to till date', 'teaching', 4],
      ['Principal', 'University College of Law, AU', '', 'administrative', 5],
      ['Chairman', 'Faculty of Law, Andhra University', '', 'administrative', 6]
    ];
    for (let exp of experience) {
      await pool.query(`INSERT INTO faculty_experience (faculty_id, title, institution, period, type, display_order) VALUES (?, ?, ?, ?, ?, ?)`, [vcId, ...exp]);
    }

    // Awards
    const awards = [
      ['Received "BEST TEACHER" by the Government of Andhra Pradesh', 'Govt of AP', '2015'],
      ['Best Researcher Award', 'Andhra University', '2007'],
      ['Dr. Sarvepalli Radhakrishna Best Teacher Award', 'Andhra University', '2009']
    ];
    for (let award of awards) {
      await pool.query(`INSERT INTO faculty_awards (faculty_id, title, organization, year) VALUES (?, ?, ?, ?)`, [vcId, ...award]);
    }

    // Research Meta
    const meta = [
      ['Ph.D\'s Awarded', '58', 'guidance', 1],
      ['Ph.D\'s Thesis submitted', '5', 'guidance', 2],
      ['Ph.D Scholars presently doing research', '20', 'guidance', 3],
      ['Post Graduation Guided', '200 Dissertations', 'guidance', 4],
      ['Environment Project', 'Eco-Legal Management of Ground Water and Aquaculture – Godavari Basin study sponsored by World Bank', 'project', 5],
      ['Women Empowerment Project', 'Empowerment of Women-an Empirical study of five coastal districts financed by U.G.C.', 'project', 6]
    ];
    for (let m of meta) {
      await pool.query(`INSERT INTO faculty_research_meta (faculty_id, meta_key, meta_value, type, display_order) VALUES (?, ?, ?, ?, ?)`, [vcId, ...m]);
    }

    // Publications (Full CV Data)
    const publications = [
      ['book', 'Constitutional Jurisprudence and Environmental Justice', 'Festschrift volume in honour of Prof. A Lakshminath', '2002', '', 1],
      ['book', 'Enculturing Constitutionalism and Transformative Justice from Dharmoprudence to Demosprudence (Edited)', 'Sir Alladi Krishna Swamy Ayer Endowment Lecture', '2022', 'By Prof. A. Lakshminath', 2],
      ['book', 'Jurisprudence and Legal Theory of E.B.C Publication (Revision)', 'E.B.C Publication, Lucknow', 'Present', '', 3],
      ['book', 'The Anatomy of Indian Legal Education', 'S. SIVAKUMAR, PRAKASH SHARMA', '2020', 'Continuing Legal Education', 4],
      ['book', 'Re-inventing Laws through Judicial Activism', 'Indian Law Institute, New Delhi', '2023', '', 5],
      ['book', 'Pioneering Indian Legal Education', 'NLUJ L. REV. 1', '2025', '', 6],

      ['article', 'Public Interest Litigation – A Revolutionary Change in Judicial Process', 'Souvenir by A.P. Bar Council', '1986', '', 7],
      ['article', 'Compensation through writs – A revolutionary change in Judicial Process', 'Young Lawyer', '1992', '', 8],
      ['article', 'Secularism', 'Young Lawyer', '1993', '', 9],
      ['article', 'Secularism – Need of the hour', 'Supreme Court Journal', '1992', '', 10],
      ['article', 'Implementation of Mandal Commission Report – An Unequal Distribution of Benefits', 'Supreme Court Journal', '1993', '', 11],
      ['article', 'Reservation Policy – some reflections with Special reference to Mandal case', 'Supreme Court Journal', '1993', '', 12],
      ['article', 'Right to Education – To Whom? Against whom?', 'Supreme Court Journal', '1994', '', 13],
      ['article', 'Social Justice through Constitutionalism- Relevance of Ambedkarism today', 'Rawat Publications, Jaipur', '1997', '', 14],
      ['article', 'An interview on Elections', 'Eenadu', '1991', '', 15],
      ['article', 'Search and Seizure – Constitutional and Legal Perspectives', 'Supreme Court Journal', '1995', '', 16],
      ['article', 'Right to Development – National and International Perspectives', 'Supreme Court Journal', '1995', '', 17],
      ['article', 'Election Commission – single body or Multiple body', 'Supreme Court Journal', '1995', '', 18],
      ['article', 'Election Commission – Structure – Problems – Prospects', 'A.U. Law College Journal', '1996', '', 19],
      ['article', 'Right to Privacy', 'Research Notes, Andhra University', '1997', '', 20],
      ['article', 'Judicial Activism or Tyranny', 'Vartha Daily', '1996', '', 21],
      ['article', 'Political Shadow on the Constitution', 'Vartha Daily', '2000', '', 22],
      ['article', 'Indian Constitution – An instrument to bring social change', 'Supreme Court Journal', '1997', '', 23],
      ['article', 'Interaction between law and Society', 'Supreme Court Journal', '1997', '', 24],
      ['article', 'Economic Analysis of Law – Indian Experience', 'A.U. Law Journal', '2000', '', 25],
      ['article', 'Manava Hakkulu – Avagahana', 'Book on Human Rights (Telugu)', '2000', '', 26],
      ['article', 'Constitutional justice – Ambedkar’s perspective', 'Commemorative volume (Aligarh)', '2003', '', 27],
      ['article', 'Development & Information Technology vis-a-vis social control through Law', 'Berhampur University Law Journal', '2001', '', 28],
      ['article', 'Governor – An Independent Constitutional Authority or otherwise', 'Festschrift in honour of Prof. A. Lakshminath', '2002', '', 29],
      ['article', 'Constitutional Obligations – Problems and policy perspectives', 'Supreme Court Journal 2001(4)', '2001', '', 30],
      ['article', 'Judicial Accountability vis-à-vis Rule of Law', 'University Law College, Utkal University', '2001', '', 31],
      ['article', 'Intellectual property Rights & Human Rights', 'Education & Space', '2002', '', 32],
      ['article', 'Women Property Rights – Need to have uniform Law', 'Book on Women and Law', '2002', '', 33],
      ['article', 'Social Justice & Constitutionalism – Ambedkar’s perspective', 'Festschrift in honour of Prof. A. Lakshminath', '2003', '', 34],
      ['article', 'Human Rights through Constitutional Culture', 'Berhampur University Law Journal', '2004', '', 35],
      ['article', 'Uniform Succession Code', 'Supreme Court Journal', '2002', '', 36],
      ['article', 'Environment- Law & Policy Perspectives', 'NALSAR UNIVERSITY OF LAW, HYDERABAD', '2002', '', 37],
      ['article', 'New Patent Regime and Intellectual Property Rights Jurisprudence', 'A.U. Law Journal', '2003', '', 38],
      ['article', 'Cyber crimes including cyber squatting', 'NALSAR UNIVERSITY of Law, Hyderabad', '2005', '', 39],
      ['article', 'Human Right Education – Need of the Hour', 'NALSAR UNIVERSITY of Law, Hyderabad', '2005', '', 40],
      ['article', 'Human Rights – Ideology and practice', 'Journal of Indian Legal Thought (JILT) vol 1', '2003', '', 41],
      ['article', 'Relevance of Ancient Indian Legal Thought Today', 'Journal of Indian Legal Thought (JILT) vol 2', '2005', '', 42],
      ['article', 'Human Rights Jurisprudence – Problems and Prospects', 'Concept Publishers, New Delhi', '2005', '', 43],
      ['article', 'Uniform succession code – a first step to Uniform Civil code', 'Festschrift in honour of Prof. N. S. J. Rao', '2003', '', 44],
      ['article', 'The impact of DNA Technology on law', 'Guru Nanak Dev University, Jalandhar', '2004', '', 45],
      ['article', 'Right to education – constitutional Conundrum', 'Minorities National Seminar, Hyderabad', '2003', '', 46],
      ['article', 'Protection of copyright through law in internet age', 'Book Vision Srinagar', '2005', '', 47],
      ['article', 'Constitutional Justice – Ambedkar Perspective', 'Constitutional Jurisprudence & Environmental Justice', '2002', '', 48],
      ['article', 'Aqua culture', 'Environment Law and Policy, Bhimavaram', '2003', '', 49],
      ['article', 'IPR – New Agenda for Developing Countries', 'Visakhapatnam Seminar', '2004', '', 50],
      ['article', 'Development of Human Rights through Judicial process', 'Asia Law House', '2005', '', 51],
      ['article', 'IPR a Boon or Bane for Indian agriculture', 'Visakhapatnam Seminar', '2004', '', 52],
      ['article', 'Right to Information Act, A Realistic Appraisal', 'Journal of Juridical Sciences, Tirupati', '2006', '', 53],
      ['article', 'Revenue Administration Study Material on Law', 'LBSNAA, Musoorie', '2007', '', 54],
      ['article', 'Bharat Ratna Indira Gandhi', 'Indira Gandhi Chair, SPMV (Women University Tirupati)', '2008', '', 55],
      ['article', 'Standard of Legal Education, Professional Competence and Responsibility', 'Asia Law House', '2008', '', 56],
      ['article', 'Taking Law Seriously', 'Apex Law Journal', '2008', '', 57],
      ['article', 'Impact of human rights capabilities, aspirations and editions on law and justice', 'Universitas Journal Vol 1-15', '2020', '', 58],
      ['article', 'The Anatomy of Indian legal education', 'CLEA - Thomson Reuters', '2020', '', 59],
      ['article', 'Law as an experiential social value', 'Int. Journal Interdisciplinary Res.', '2015', 'ISSN: 2456-4567', 60],
      ['article', 'Uniform Succession Code for equal property rights', 'Int. Journal Interdisciplinary Res.', '2016', 'ISSN: 2456-4567', 61],
      ['article', 'Uniform Civil Code – Need of the Hour', 'Int. Journal Interdisciplinary Res.', '2017', 'ISSN: 2456-4567', 62],
      ['article', 'Protection of Human Rights through Judicial Activism', 'Int. Journal Interdisciplinary Res.', '2019', 'ISSN: 2456-4567', 63],
      ['article', 'The evolution of Indian State...', 'Int. Journal Interdisciplinary Res.', '2020', 'ISSN: 2456-4567', 64],
      ['article', 'Relevant of Ancient Culture, Heritage and Legal Thought to day', 'Int. Journal Interdisciplinary Res.', '2021', 'ISSN: 2456-4567', 65],
      ['article', 'Role of Law in making Hindutwa as Indian way of life', 'Int. Journal Interdisciplinary Res.', '2021', 'ISSN: 2456-4567', 66],
      ['article', 'Indian Supreme Court and right to privacy', 'Int. Journal Interdisciplinary Res.', '2021', 'ISSN: 2456-4567', 67],
      ['article', 'Right to privacy and human dignity', 'Int. Journal Interdisciplinary Res.', '2021', 'ISSN: 2456-4567', 68],
      ['article', 'Ancient Hindu Jurisprudence', 'Int. Journal Interdisciplinary Res.', '2022', 'ISSN: 2456-4567', 69],
      ['article', 'The success of Roman Law', 'Int. Journal Interdisciplinary Res.', '2022', 'ISSN: 2456-4567', 70],
      ['article', 'Law as product of culture – Indian Perspective', 'Int. Journal Interdisciplinary Res.', '2022', 'ISSN: 2456-4567', 71]
    ];
    for (let pub of publications) {
      await pool.query(`INSERT INTO faculty_publications (faculty_id, type, title, journal_book_name, year, details, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [vcId, ...pub]);
    }

    // Conferences (Full CV Data)
    const conferences = [
      // International
      ['Indigenous Peoples’ Rights Program', 'Institute for the Study of Human Rights, Columbia University, USA', '14-15 May 2016', 'international', 'Participated', 1],
      ['15th Session of United Nations Permanent Forum on Indigenous Issues', 'UN HQ, New York, USA', '9-20 May 2016', 'international', 'Participated', 2],
      ['International Symposium on Cultural Diplomacy in the UN', 'New York City', '26-30 May 2016', 'international', 'Participated', 3],
      ['Consultation on Science Technology and Innovation for SDGs', 'Conference Room-7, NY, USA', '17 May 2016', 'international', 'Participated', 4],
      ['Indigenous Women at the Forefront of Peace Movement', 'Bahai, UN Office, New York, USA', '18 May 2016', 'international', 'Participated', 5],
      ['World Humanitarian Summit', 'UNO, Istanbul, Turkey', '23-26 May 2016', 'international', 'Presented a paper/Participated online', 6],
      
      // National / Papers Presented
      ['Public Interest Litigation – A Revolutionary Change', 'Bar Council of Andhra Pradesh, Hyderabad', '1987', 'national', 'Presented Paper', 7],
      ['New International Economic Order', 'Nagpur University, Nagpur', '1987', 'national', 'Presented Paper', 8],
      ['Compensation Through writs', 'Andhra University', '1989', 'national', 'Presented Paper', 9],
      ['Secular India – Problems and Prospects', 'National Seminar at Hyderabad', '1988', 'national', 'Presented Paper', 10],
      ['Challenges to Constitutional Fundamentals', 'S.V. university', '1991', 'national', 'Presented Paper', 11],
      ['Judicial Review A Comparative study', 'Andhra University', '1988', 'national', 'Presented Paper', 12],
      ['59th Constitutional Amendment', 'Seminar at Eluru', '1988', 'national', 'Presented Paper', 13],
      ['Problems of Reservations and Judicial Response', 'Aligarh Muslim University, Aligarh', '22-23 April 1996', 'national', 'Presented Paper', 14],
      ['Unilateralism Vs. Multilateralism', 'Madras University', '22-23 Jan 1996', 'national', 'Presented Paper', 15],
      ['Accountability of Whom? To whom?', 'Madras University', '28-29 March 1996', 'national', 'Presented Paper', 16],
      ['Social Justice – A myth or Reality', 'Andhra University', '1996', 'national', 'Presented Paper', 17],
      ['The Rights of the Girl Child', 'National Seminar at Hyderabad', '1997', 'national', 'Presented Paper', 18],
      ['Issues before W.T.O. – Indian Perspective', 'Andhra University', '1999', 'national', 'Presented Paper', 19],
      ['Human Rights to Dalits – Myth or Reality', 'Academic Staff College, AU', '1999', 'national', 'Presented Paper', 20],
      ['Preventive Detention – Individual vs Social Justice', 'Dhankanal, Orissa', '2000', 'national', 'Presented Paper', 21],
      ['Difficulties in Translating Laws', 'Department of Telugu, Andhra University', '2000', 'national', 'Presented Paper', 22],
      ['Social Control of Information Technology', 'Engineering College, AU', '9-10 Sept 2000', 'national', 'Presented Paper', 23],
      ['IPR regions - Poverty Alleviation', 'Barkatulla University, Bhopal', '2-5 Oct 2001', 'national', 'Presented Paper', 24],
      ['Judicial Accountability Vis-à-vis Rule of Law', 'Utkal University, Bhubaneswar', 'Aug 2001', 'national', 'Presented Paper', 25],
      ['Impact of IPR on Indian Agriculture', 'SISS, Hyderabad', '11-12 Oct 2002', 'national', 'Presented Paper', 26],
      ['Ancient Legal Thought Today', 'Mahatma Gandhi University, Kottayam', '7-8 Dec 2004', 'national', 'Presented Paper', 27],
      ['Protection of Copy Right in Internet Age', 'Osmania University, Hyderabad', '13-14 March 2004', 'national', 'Presented Paper', 28],
      ['DNA Technology and Law', 'Guru Nanak Dev University, Jalandhar', '27-28 March 2004', 'national', 'Presented Paper', 29],
      ['IPR Law and Policy Emerging Trends', 'Dept Law, AU', '16 July 2005', 'national', 'Presented Paper', 30],
      ['IHL Awareness Program', 'Faculty of Law, AU and ICRC', '24-25 Aug 2005', 'national', 'Participated', 31],
      ['Globalization State and Human Rights', 'S.V. University, Tirupati', '2006', 'national', 'Presented Paper', 32],
      ['Maintenance and Welfare of Parents', 'Dept of Social Work, AU', '9 Feb 2008', 'national', 'Presented Paper', 33],
      ['Human Rights Violation in India', 'Andhra Pradesh Human Resource Department', '25 March 2017', 'national', 'Delivered Lecture', 34],
      ['Properties Law', 'University of Madras, Chennai', '18 March 2017', 'national', 'Presented Paper', 35]
    ];
    for (let conf of conferences) {
      await pool.query(`INSERT INTO faculty_conferences (faculty_id, title, details, date, type, role, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [vcId, ...conf]);
    }

    // Professor Nandini C.P
    console.log('Seeding Prof. Nandini C.P...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['nandini-cp']);
    const [nandiniResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Prof. Nandini C.P',
        'nandini-cp',
        'Professor',
        'https://dsnlu.ac.in/storage/2022/12/Dr.-Nandini.jpg',
        'BAL., LL.B., LL.M., MMM Ph.D., A.L, LL.B., UGC / NET in Law.',
        '+91- 8317502839',
        'nandinicp@dsnlu.ac.in',
        'Professor of Law, Damodaram Sanjivayya National Law University',
        'Criminal law, Cyber Law, Private International Law, Law of Evidence, IPR, Commercial Law and Marketing',
        'regular'
      ]
    );
    const nId = nandiniResult.insertId;

    // Research Meta / Objective
    await pool.query(`INSERT INTO faculty_research_meta (faculty_id, meta_key, meta_value, type) VALUES (?, ?, ?, ?)`, 
      [nId, 'Objective', 'To be an excellent and admirable academician and researcher.', 'other']);

    // Nandini Publications (Full Data Portfolio)
    const nPubs = [
      // Journal Articles
      ['article', 'Joint Criminal Liability (JCL)- Nomenclature vs Liability Challenges with reference to Parasitic Criminal Liability', 'Vol 11, Pp 28-52', '2021', 'ISSN: 2231 5144', 1],
      ['article', 'Detecting and Preventing Click Fraud: The Economic and Legal Aspects', 'IUP Law Review Vol. IX, No. 2, Pp. 46-68', '2019', 'ISSN: 2231-3095 | Ref No: 9772233130900902', 2],
      ['article', 'B2C- E Commerce and Consumer Protection', 'Int. Journal of Consumer law and Practice, VI EBC, NLSIU Bengaluru, Pp.74-87', '2018', 'ISSN: 2347-2731', 3],
      ['article', 'Complexity in Appreciating Evidence in Civil Litigation-Method to be validated by Courts in India', 'ALT (Two Parts), RNI No. 69919/99, CCXII, Pp. 13-24', '2018', 'RNI No. 69919/99', 4],
      ['article', 'Presumptions: Imprecise Definition and Obscurity in its Application by Courts', 'ALT (Criminal) Vol. LXII, Pp. 9-16', '2017', 'N.I. No. 1999/304', 5],
      ['article', 'Spying in virtual world- A Legal Perspective on Spyware', 'KLJ Part No. 1, 1-8', '2014', 'KA/BGW235/2013-15 | RNI No. 1999/304', 6],
      ['article', 'Resolution of Domain Name Disputes through ADR- Impact of WIPO’s Initiative Towards eUDRP', 'JILI Vol. 52 No. 1, 80-91', '2010', 'ISSN: 0019-5731 | Co-authored with Prof G. B Reddy', 7],
      ['article', 'Equal Pay for Equal “Value” of Work – Indian Supreme Court Confirms', 'ICFAI Journal of Employment Law, Vol IV, Pp. 26-41', '2006', 'ISSN: 0972-7868 | Ref # 17J-2006-07-06-01', 8],
      ['article', 'Legal Framework on Privacy Issues in Online Advertising', 'Advertising Express Vol IX Issue 6, Pp. 29-33', '2009', 'ISSN: 0972-532 | Ref # 18M-2009-06-05-01', 9],
      ['article', 'Cyberlaw in Cyberspace: Regulating Spam', 'Advertising Express Vol IX, 29-33', '2009', 'ISSN: 0972-5326 | Ref # 18M-2009-07-04-01', 10],
      ['article', 'Marketers to Safeguard Consumers – Consumer Protection and Legislative Actions', 'ICFAI University Press, Vol. VIII Issue 7, Pp. 28-31', '2008', 'ISSN: 0972-5326 | Ref # 18M-2008-07-05-01', 11],
      ['article', 'Elizabeth Georgina Elzona Stewart vs. Dr. M Botha & Dr. S Small (Medical Negligence)', 'ICFAI Journal of Health Care Law, VII, No. 1, Pp. 77-78', '2009', 'ISSN: 0972-785X | Ref # 16J-2009-02-06-10', 12],
      ['article', 'Board of Trustees, Visakhapatnam Port Trust vs. TSN Raju & Another', 'ICFAI Journal of Employment Law, Vol V No. 1, 91-92', '2007', 'ISSN: 0972-7868 | Ref # 17J-2007-01-07-09', 13],
      ['article', 'You are at My Will to Subsist in this Job: A Case Study', 'ICFAI Journal of Employment Law, Vol. IV, Pp. 79-81', '2006', 'ISSN: 0972-7868 | Ref # 17J-2006-01-10-09', 14],
      ['article', 'Public Health Plight of Non-Resident Pensioners in Britain', 'Employment Law Journal and Courseware', '', 'Case Note', 15],

      // Book Chapters
      ['book', 'Back to the Future Saga of Distress and Triumph by LGBTQ+', 'Gender Equality Issues and Challenges, Satyam Law International', '2023', 'Edited by Prof (Dr.) Priya Sepaha', 16],
      ['book', 'Intellectual Property Justification: An Economic approach', 'Intellectual Property Rights in Knowledge Era, DPIIT IPR-Chair, OU', '2022', 'ISBN: 978-93-91088-21-7 | Pp. 3 – 20', 17],
      ['book', '“Bagless Days” Toward VET: NEP 2020', 'National Education Policy 2020: The Road Ahead, NLUJA, Assam', '2022', 'ISBN: 978-81-954276-1-1', 18],
      ['book', '112@21st Century – Calls Revisit', 'Indian Evidence Act Sesquicentennial Volume, NUSRL, Ranchi', '2022', 'ISBN: 978-81-952237-1-8', 19],
      ['book', 'Back to the Future – Saga of Distress & Triumph (Accepted)', 'Gender Equality: Issues and Challenges, Law Colloquy', '2022', 'Accepted for Publication', 20],
      ['book', 'Battered Woman Syndrome: A Premonition as Mental Health', 'Law and Mental Health (Clinic to Community Care), DSNLU', '2021', 'ISBN: 978-81-954245-1-9', 21],
      ['book', 'Plug the Risk in Cyberspace: Insurance Shield', 'Insurance Business & Changing Dynamics, ALT Publications', '2019', 'ISBN: 978-93-90255-07-8', 22],
      ['book', 'Selection of Research Problem', 'Readings in Legal and Social Research, Regal Publications', '2019', 'ISBN 978-81-938829-3-1', 23],
      ['book', 'Criminalization of Copyright Infringements', 'Copyright Law in the Digital World, ILI and Springer', '2017', 'ISBN 978-981-10-3983-6', 24],
      ['book', 'Product liability- A Legislation in Necessity', 'Tort Reforms Debate Emerging Trends, Amicus Books', '2008', 'ISBN: 978-81-314-1857-4', 25],
      ['book', 'Online Contracts and Legal Framework in India', 'E-Contract Concepts and Conventions, Amicus Books', '2008', 'ISBN 978-81-314-1776-8', 26],

      // Book Reviews
      ['article', 'Review: Internet Law – Text and Material by Chris Reed', 'ICFAI Journal of Cyber Law, Vol. VI, No. 3, 83-85', '2007', 'ISBN: 0972-6934', 27],
      ['article', 'Review: Labour Justice System in India by Dr, T Sudhakar', 'ICFAI Journal of Employment Law, Vol. V, 2, Pp. 72-74', '2007', 'ISBN: 0972-7868', 28],
      ['article', 'Review: Practical Guide to Payment of Wages Act by H L Kumar', 'ICFAI Journal of Employment Law, IV, No. 3, Pp. 75-76', '2006', 'ISBN: 0972-7868', 29],
      ['article', 'Review: Transfer of Employees by H L Kumar', 'ICFAI Journal of Employment Law, III, Pp. 80-81', '2005', 'ISBN No. 0972-7868', 30],

      // Edited Books
      ['book', 'Essays on Kant’s Philosophy (Editor)', 'DSNLU', '2022', 'ISBN: 978-81-954254-2-6', 31],
      ['book', 'Homicide- Issues and Defenses (Editor)', 'Amicus Books', '2009', 'ISBN: 978-81-314-1858-1', 32],
      ['book', 'Same Sex Marriages: An Overview (Editor)', 'Amicus Books', '2008', 'ISBN: 978-81-314-1809-9', 33],
      ['book', 'Rape – Law Reforms Comparative Perspective (Editor)', 'Amicus Books', '2008', 'ISBN: 978-81-314-1816-1', 34],
      ['book', 'Right to Social Security: Intl Perspective (Editor)', 'Amicus Books', '2007', 'ISBN: 81-314-0659-8', 35],
      ['book', 'Globalization and Labour Laws (Editor)', 'Amicus Books', '2007', 'ISBN: 81-314-0663-6', 36]
    ];
    for (let pub of nPubs) {
      await pool.query(`INSERT INTO faculty_publications (faculty_id, type, title, journal_book_name, year, details, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [nId, ...pub]);
    }

    // Nandini Conferences, Keynotes & Resource Person Roles
    const nConfs = [
      // International Presentations
      ['Criminal Liability for Damaging Environment', 'CEERA-NLSIU Bengaluru (Intl)', 'June 2023', 'international', 'Presented Paper', 1],
      ['Incentives in Justification of IP', 'NTU Singapore (Intl)', 'March 2023', 'international', 'Presented Paper', 2],
      ['Video Games Promote Violent Behaviour', 'NUJS Intl Conference', 'Dec 2021', 'international', 'Presented Paper', 3],
      
      // Resource Person / Guest Lectures
      ['IPR – Practice and Procedure', 'RPA Education Society Bengaluru', 'May 8, 2023', 'national', 'Resource Person', 4],
      ['Justification for IP Protection', 'DPIIT-IPR Chair; MNLU Nagpur', 'May 6, 2023', 'national', 'Resource Person', 5],
      ['Gender Justice at Work Place', 'JSS Dental College', 'April 29, 2023', 'national', 'Resource Person', 6],
      ['Police, Prison and Judiciary Coordination', 'Central Jail Visakhapatnam', 'March 13, 2023', 'national', 'Invited Speaker', 7],
      ['Women Rights and Duties', 'MVGR College, Vizianagaram', 'Nov 25, 2022', 'national', 'Guest Speaker', 8],
      ['Ethical Challenges of Sexual Health', 'UNESCO Chair in Bioethics (Intl)', 'Oct 19, 2022', 'international', 'Panelist', 9],
      ['Divisional Application Jurisprudence', 'WIPO India Summer School', 'June 2, 2022', 'international', 'Panelist', 10],
      ['Rationale for IP Protection', 'Galgotias University', 'Aug 24, 2021', 'national', 'Key Note Speaker', 11],
      ['Comparative Analysis of Constitutions', 'US Consulate Workshop', 'Nov 7, 2020', 'international', 'Resource Person', 12],
      ['Video Games & Gender Violence', 'Radio Talk (AIR)', 'Feb 17, 2020', 'national', 'Speaker', 13],
      ['Gender Sensitization for Govt Officers', 'APHRDI', 'Dec 13, 2018', 'national', 'Resource Person', 14],

      // Organized Events
      ['Forensic Science in Law Schools', 'NFSU Workshop', 'April 6, 2022', 'national', 'Organizer', 15],
      ['Law of Evidence Workshop', 'DSLIC Online', 'Oct 10, 2020', 'international', 'Organizer', 16],
      ['Immanuel Kant and Transformative Justice', 'DSNLU', 'Dec 2019', 'international', 'Organizer', 17],
      ['Entrepreneurship in Law', 'DSNLU Workshop', 'March 2023', 'national', 'Organizer', 18],
      ['Crime Scene Investigation', 'DSNLU', 'Sept 24, 2022', 'national', 'Organizer', 19],
      ['Civil Trial Advocacy', 'DSNLU', 'March 1-3, 2019', 'national', 'Organizer', 20],
      ['Criminal Trial Advocacy', 'DSNLU', 'Oct 11-13, 2018', 'national', 'Organizer', 21]
    ];
    for (let conf of nConfs) {
      await pool.query(`INSERT INTO faculty_conferences (faculty_id, title, details, date, type, role, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [nId, ...conf]);
    }

    // 3. Dr. Dayananda Murthy C.P
    console.log('Seeding Dr. Dayananda Murthy C.P...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['dayananda-murthy-cp']);
    
    const dayanandaBio = `He is a graduate in law from Mysore University and LL.M. from, Department of Legal Studies, Bangalore University. Has a Masters Degree in Foreign Trade. His Doctoral Degree thesis is on “Copyright in the Digital Media- a Critical Analysis with Reference to India.” His Research area includes Law of Contracts, Corporate Laws with Mergers and Acquisitions, Foreign Exchange Laws, Competition/Anti-Trust Laws and Intellectual Property Rights. He was Assistant Professor at the National Judicial Academy, Bhopal; Gujarat National Law University (GNLU), Gandhinagar; Faculty Member, Law School & Academic Coordinator, ICFAI Business School, Bangalore, M.S. Ramaiah College of Law, Bangalore, JSS College of Law, Mysore and SJRC College of Law, Bangalore. He has published in various journals articles and attended Seminars, Workshop and Conferences. He had chaired sessions at the National Seminars. He had organized the two International Moot Court Competition at GNLU and 1st DSNLU National Moot Court Competition. He was working as visiting faculty at M.S Ramaiah School of Management, Bangalore and Pandit Den Dayal Petroleum University, Gandhinagar. He had participated in Philip Jessup International Moot Court Competition as a student. He had been a judge in Stetson International Moot Court Competition held Bhopal.`;

    const [dayanandaResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Dr. Dayananda Murthy C.P',
        'dayananda-murthy-cp',
        'Associate Professor',
        'https://dsnlu.ac.in/storage/2022/12/Dr.-Dayananda.jpg',
        'B.A.L. LL.M., M.F.T., Ph.D.',
        '',
        'dayanandamurthi@dsnlu.ac.in',
        'Associate Professor, Damodaram Sanjivayya National Law University',
        'Law of Contracts, Corporate Laws, Mergers and Acquisitions, Foreign Exchange Laws, Competition/Anti-Trust Laws, IPR',
        dayanandaBio,
        'regular'
      ]
    );
    const dId = dayanandaResult.insertId;

    await pool.query(`INSERT INTO faculty_research_meta (faculty_id, meta_key, meta_value, type) VALUES (?, ?, ?, ?)`, 
      [dId, 'Profile Highlights', 'Moot Court Coach & Judge (Jessup, Stetson), Organized Intl Moots at GNLU.', 'other']);

    // 4. Dr. P. Jogi Naidu
    console.log('Seeding Dr. P. Jogi Naidu...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['p-jogi-naidu']);
    
    const jogiBio = `To contribute to the advancement of legal education through innovative pedagogy, updated curriculum design, and the integration of emerging legal domains. I aim to foster a collaborative academic environment that equips students with contemporary legal knowledge, technological skills, and professional competence. I intend to introduce and strengthen courses related to technology law, environmental law, and international human rights while integrating digital tools and platforms to prepare students for the evolving legal landscape.`;

    const [jogiResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Dr. P. Jogi Naidu',
        'p-jogi-naidu',
        'Associate Professor',
        'https://dsnlu.ac.in/storage/2022/12/Mr.-Jogi-Naidu-2.jpg',
        'B.Sc., MHRM., LLM., Ph.D.',
        '9910927182',
        'pjoginaidu1@dsnlu.ac.in',
        'Associate Professor of Law, Damodaram Sanjivayya National Law University',
        'Space Law, Aviation Law, Environmental Law, Technology Law, Corporate and Taxation Law, Digital Media Law, Human Rights',
        jogiBio,
        'regular'
      ]
    );
    const jId = jogiResult.insertId;

    // Research Meta & Projects & Administrative
    const jogiMeta = [
      ['Doctoral Research', 'Ph.D. (2023) - Legal Dimensions of Loss of Life or Property during Air Travel - AU | LLD (Pursuing) - Space Law - DSNLU', 'guidance', 1],
      ['Ph.D Thesis Evaluation', 'ICFAI Law School, Hyderabad – Thesis on Environmental Corporate Crimes', 'guidance', 2],
      ['Ph.D Thesis Evaluation', 'Padmavathi Mahila Vishwavidyalayam, Tirupati – Thesis on Money Laundering Laws', 'guidance', 3],
      ['Administrative Leadership', 'Registrar (I/C) – June to Dec 2023 | Chief Warden (Boys Hostels) – 2022 & 2024 | Officer on Special Duty (OSD – Admin) – 2024', 'leadership', 4],
      ['University Committees', 'Member, Academic Council – 2024 | Examination Committee Member – 2017 to Present | Nodal Officer – AIU (2020) | Coordinator – UG Council, Faculty Mentoring, Semester Coordination', 'leadership', 5],
      ['Honorary Chairperson', 'Centre for ADR | Centre for Corporate Legal Research | Centre for Maritime, Admiralty and Navigation Laws (C-MAN) | Centre for Fashion, Media & Entertainment Laws | Centre for Aviation & Space Laws', 'leadership', 6],
      ['Convener / Member', 'Disciplinary Committee, NAAC Committee, Mess Committee, Internship & Placement Committee, Anti-Ragging Committee, Sports Committee, Tenders & Purchase Committee, Caste Discrimination Committee, Alumni Committee', 'leadership', 7]
    ];
    for (let m of jogiMeta) {
      await pool.query(`INSERT INTO faculty_research_meta (faculty_id, meta_key, meta_value, type, display_order) VALUES (?, ?, ?, ?, ?)`, [jId, ...m]);
    }

    // Experience
    const jogiExp = [
      ['Associate Professor', 'DSNLU, Visakhapatnam', '6 June 2016 – Present', 'teaching', 1],
      ['Cabin Crew', 'Air India Express', '24 January 2005 – 2016', 'other', 2]
    ];
    for (let exp of jogiExp) {
      await pool.query(`INSERT INTO faculty_experience (faculty_id, title, institution, period, type, display_order) VALUES (?, ?, ?, ?, ?, ?)`, [jId, ...exp]);
    }

    // Publications (Full CV Data Portfolio)
    const jogiPubs = [
      ['article', 'Cybersecurity Laws in India and Beyond: A Comparative Legal Perspective', 'IJMH, Vol.12(2)', '2025', 'Comparative Legal Perspective', 1],
      ['article', 'Case Comment: Bhagwandas B. Ramchandani v. British Airways (2022)', 'IJIRL', '2025', 'Jan 2025', 2],
      ['book', 'Legal Dimensions of Loss of Life or Property During Air Travel and Scope of Compensation in India', 'Roshan Publications', '2023', 'ISBN 978-93-90028-63-4', 3],
      ['article', 'Work-Life Balance and Mindfulness in Indian Scriptures', 'Library Progress International (SCOPUS)', '2024', '', 4],
      ['article', 'Reforms in Space Sector in India', 'NALSAR Law Review', '2023', '', 5],
      ['article', 'International Legal Perspectives on Civil Liability for Nuclear Damage', 'IJFNS (UGC CARE)', '2022', '', 6],
      ['article', 'Digital Media Revolution in India', 'Russian Law Journal (SCOPUS)', '2022', '', 7],
      ['article', 'Legal Compliance in Establishing New Airports', 'IJLPSR', '2024', '', 8],
      ['article', 'Covid-19 Effect on Aviation Sector', 'IJMER', '2022', '', 9],
      ['article', 'Remote Sensing and Benefit Sharing in Aviation & Space', 'ANU Law Journal', '2022', '', 10]
    ];
    for (let pub of jogiPubs) {
      await pool.query(`INSERT INTO faculty_publications (faculty_id, type, title, journal_book_name, year, details, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [jId, ...pub]);
    }

    // Conferences & Invited Roles
    const jogiConfs = [
      // Papers Presented
      ['International Conference on Aerodrome Requirements', 'WBNUJS, Kolkata', '2024', 'international', 'Presented Paper', 1],
      ['National Conference on Smart City Technology', 'NLU Delhi', '2024', 'national', 'Presented Paper', 2],
      ['International Conference on Space Law', 'DSNLU', '2019', 'international', 'Presented Paper', 3],
      ['National Seminar on ILO & Child Rights', 'DSNLU', '2019', 'national', 'Presented Paper', 4],
      ['National Seminar on Climate Change', 'NLSIU Bengaluru', '2018', 'national', 'Presented Paper', 5],
      // Organised
      ['One-day Seminar on Aviation Law', 'Speaker: Shri Ravi Nath, RNC Legal', '', 'national', 'Organized', 6],
      ['Three-Day International Pre-Vis Moot', 'Centre for ADR', 'Feb 2025', 'international', 'Chairperson / Organizer', 7],
      ['Seminar as Faculty Convener', 'Centre for Fashion, Media & Entertainment Law', 'Oct 2024', 'national', 'Faculty Convener', 8],
      // Resource Person
      ['Subject Expert, APSLPRB APP Descriptive Paper Valuation', 'Govt of AP', '2025', 'national', 'Subject Expert', 9],
      ['External Examiner for Ph.D Viva', 'ICFAI Law School', '2025', 'national', 'External Examiner', 10],
      ['Lecture at Tribal Welfare Department', 'Govt. of AP', '2023', 'national', 'Resource Person', 11],
      ['ICSSR National Workshop – Logical Write-up Methods', 'ICSSR', '2022', 'national', 'Resource Person', 12],
      ['NACIN – Indirect Taxation', 'NACIN', '2021', 'national', 'Resource Person', 13],
      ['UNDP–GEF Workshop on Biodiversity Laws', 'UNDP', '2019', 'international', 'Resource Person', 14],
      // FDPs
      ['Seven-Day FDP on Contemporary Trends in Legal Education', 'CMR University', '2025', 'national', 'Participated', 15],
      ['4-Week Induction/Orientation Programme', 'Ramanujan College, DU', '2021', 'national', 'Participated', 16],
      ['Various FDPs participated', 'DSNLU, NALSAR, NLSIU, GITAM, CUTN, WIPO, ICSSR, APIS', '', 'national', 'Participated', 17],
      // Chaired
      ['National Webinar on Traditional Knowledge Protection', 'DSNLU', '2022', 'national', 'Chairperson', 18],
      ['Sports Law Governance Seminar', 'DSNLU', '2021', 'national', 'Chairperson', 19],
      ['Dr. MVVS Murthy National Moot Court Competition', 'DSNLU/GITAM', '2020', 'national', 'Judge', 20],
      ['Conference on Direct Taxes', 'DSNLU', '2019', 'national', 'Co-Chairperson', 21],
      // Attended
      ['International E-Conference on Law & Spirituality', 'CLC, DU', '2021', 'international', 'Attended', 22],
      ['TECH Conference', 'UNESCO & Govt. of India', '2017', 'international', 'Attended', 23],
      ['National Symposium on Geographical Indications', 'SOLT, CIPAM, NRDC', '2018', 'national', 'Attended', 24],
      ['NGT Regional Conference on Environment', 'NGT', '2017', 'national', 'Attended', 25],
      ['Workshop on Criminal Procedural Laws', 'GITAM', '2019', 'national', 'Attended', 26],
      ['International Conference on Aviation & Space Industry', 'NALSAR', '2020', 'international', 'Attended', 27]
    ];
    for (let conf of jogiConfs) {
      await pool.query(`INSERT INTO faculty_conferences (faculty_id, title, details, date, type, role, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [jId, ...conf]);
    }


    // 5. Dr. R. Bharat Kumar
    console.log('Seeding Dr. R. Bharat Kumar...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['r-bharat-kumar']);
    
    const bharatBio = `Dr. R. Bharat Kumar is an academician with over thirteen years of teaching and research experience at Damodaram Sanjivayya National Law University (DSNLU), Visakhapatnam, where he currently serves as Assistant Professor of Law and holds additional administrative roles including Assistant Registrar (Academics) and Faculty Advisor to multiple university committees.
He earned his Ph.D. in Law (Gold Medalist) from Dr. B.R. Ambedkar College of Law, Andhra University, for his doctoral research titled “Competition Policy, Law and Telugu Film Industry: A Critical Study.” He also holds an LL.M. (Gold Medalist) in Corporate Law from Sri Krishnadevaraya University and completed his B.S.L., LL.B. from ILS Law College, University of Pune.
In recognition of his academic excellence, Dr. R. Bharat Kumar received an International Fellowship to attend The Hague Academy of International Law (2013), held at the Peace Palace, The Hague, Netherlands.
His teaching and research interests span Competition Law, Labour and Industrial Law, Sports Law, and emerging technology law. He has authored two books, edited four books, and authored several research papers and chapters. His scholarly work has appeared in reputed national and international journals on topics such as digital law, social security, gender equality, and legal implications of AI.`;

    const [bharatResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Dr. R. Bharat Kumar',
        'r-bharat-kumar',
        'Assistant Professor',
        'https://dsnlu.ac.in/storage/2026/02/Bharat.jpg',
        'M.A., LL.M., Ph.D.',
        '',
        '',
        'Assistant Professor of Law, Damodaram Sanjivayya National Law University',
        'Competition Law, Labour and Industrial Law, Sports Law, Emerging Technology Law',
        bharatBio,
        'regular'
      ]
    );
    const bId = bharatResult.insertId;

    // Meta
    const bharatMeta = [
      ['Administrative Roles', 'Assistant Registrar (Academics) and Faculty Advisor to multiple university committees', 'leadership', 1],
      ['Awards & Fellowships', 'Ph.D. in Law (Gold Medalist) | LL.M. (Gold Medalist) | International Fellowship to The Hague Academy of International Law (2013)', 'other', 2]
    ];
    for (let m of bharatMeta) {
      await pool.query(`INSERT INTO faculty_research_meta (faculty_id, meta_key, meta_value, type, display_order) VALUES (?, ?, ?, ?, ?)`, [bId, ...m]);
    }

    // Publications
    const bharatPubs = [
      // Books Authored
      ['book', 'Film Industry And Competition Law In India', 'Research India Press', '', 'ISBN: 978-93-48309-80-8', 1],
      ['book', 'Living Grammar of Law: From Facts to Norms, from Rules to Justice', 'Asia Law House', '', 'ISBN: 978-93-6696-474-4', 2],
      // Books Edited
      ['book', 'Sportive Lege: A Glance on Sports Law (Edited)', 'DSNLU', '', 'ISBN: 978-81-933989-7-5', 3],
      ['book', 'Laboriuris: An Apprise On Social Security And Labour Welfare Laws (Edited)', 'DSNLU', '', 'ISBN: 978-81-933989-6-8', 4],
      ['book', 'Esport Lex Taking Guard on Sports Law (Edited)', 'DSNLU', '', 'ISBN: 978-81-933989-1-3', 5],
      ['book', 'Lectures on Interpretation of Statutes (Edited)', 'Asia Law House', '', 'ISBN: 978-93-94739-82-6', 6],
      // Journal Articles & Chapters
      ['article', 'Validity, Legality, Legitimacy: Re-imagining Service Jurisprudence through the Doctrine of Bonafides', 'The IUP Law Review, Volume 15, Issue 4', '2025', 'ISSN 2231-3095', 7],
      ['article', 'The Hands That Clean: Legal Rights of Waste Management Workers in India', 'Edited book “Managing Green II”', '', 'ISBN: 978-81-965320-1-7', 8],
      ['article', 'The New Digital Deal: How Data Is Shaping Our Social Contract', 'The IUP Law Review, Volume 15, Issue 2', '2025', 'ISSN 2231-3095', 9],
      ['article', 'Managing Digital Debris: India’s E-Waste Laws and Global Practices', 'Environmental Law & E-Waste Pollution In the 21st Century', '', 'ISBN 978-81-19121-49-6', 10],
      ['article', 'Jurisprudence in the Age of AI, Ownership, Liability, and the Quest for Legal Clarity', 'AI & IPR : Unveiling the Future', '', 'ISBN 978-81-976379-7-1', 11],
      ['article', 'Competition Law and Access to Theatres', 'International Journal for Research in Law, Volume 5, Issue 4', '', 'ISSN-2454-8715', 12],
      ['article', 'The Film Industry, Its Disputes and Role of Competition Commission', 'Cases and Materials on Competition Law', '', 'ISBN 978-81-933989-8-2', 13],
      ['article', 'A Study on Psycho-Social Factors Causing Distress in Marriage', 'Incompatible Spouses Counseling Initiative', '', 'ISBN 978-81-933989-7-5', 14],
      ['article', 'The(Draft) Labour Code on Social Security 2018: Key Highlights', 'Laboriuris: An Apprise on Social Security & Labour Welfare Laws', '2018', 'ISBN 978-81-933989-6-8', 15],
      ['article', 'Make in India: Gandhian Approach', 'Gandhian Vision , Volume 2, Issue 1', '', 'ISSN-2393-9486', 16],
      ['article', 'Access To Theatres: Fair Competition', 'Contemporary Issues And Challenges In Law(Part-II)', '', 'ISBN 978-93-92347-44-3', 17],
      ['article', 'Pink Tax: The Quantum Leap For Gender Equality', 'International Journal Of Science And Research (IJSR) ,Volume 12 Issue 11', '2023', 'ISSN: 2319-7064', 18]
    ];
    for (let pub of bharatPubs) {
      await pool.query(`INSERT INTO faculty_publications (faculty_id, type, title, journal_book_name, year, details, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [bId, ...pub]);
    }

    // Conferences
    const bharatConfs = [
      ['The Mind-Body Connection: Reproductive Health and Mental Well-Being in India', 'One Day National Seminar on “Reproductive Rights and Legal Framework Addressing Population', '15th March, 2025 (SDMLC, Mangalore)', 'national', 'Presented Paper', 1],
      ['Warfare in the Digital Age: Governing Cyber Operations Under IHL', 'International Conference on “AI and IHL: Navigating Nexus of Technology, Warfare and Global Normas', '5-7th March 2025 (TNDALU, Chennai)', 'international', 'Presented Paper', 2],
      ['AI Data Security & Privacy : The Ethical Dilemma of a Digital Age', 'Countrywide Conference on “Redefining Education in the Era of AI: Socio-legal Concerns', '1st March, 2025 (KC Law College, Mumbai)', 'national', 'Presented Paper', 3],
      ['Jurisprudence in the Age of AI, Ownership, Liability, and the Quest for Legal Clarity', 'School of Law, GITAM University', '28th February, 2025', 'national', 'Presented Paper', 4],
      ['Just Transition :Balancing Labour Rights and Climate Goals in India', 'International Workshop on Interdisciplinary Approach to climate change Education (Indo-Dutch Research Centre)', '27-28th February, 2025 (GLC, Ernakulam)', 'international', 'Presented Paper', 5],
      ['Safeguarding the human rights of a stateless person in India', 'ICFAI University, Tripura', '14-15th February 2019', 'national', 'Presented Paper', 6],
      ['Mental Health & Law: Contemporary Issues', 'DSNLU', '7th March 2019', 'national', 'Presented Paper', 7],
      ['Role of National Green Tribunal in Environmental Protection: Analysis with Recent Cases', 'Prof.Harihar Nath Tripathi Foundation', '18th March 2018', 'national', 'Presented Paper', 8]
    ];
    for (let conf of bharatConfs) {
      await pool.query(`INSERT INTO faculty_conferences (faculty_id, title, details, date, type, role, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [bId, ...conf]);
    }

    // 6. Dr. Soma Battacharjya
    console.log('Seeding Dr. Soma Battacharjya...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['soma-battacharjya']);
    
    const somaBio = `She has completed her B.A. with Distinction and M.A. in Indian History & Culture. She has completed her Law graduation in first class and a gold medalist. She has post graduation in law with criminal law specilisation with distinction and gold medal. She has qualified UGC-NET in Law. she was working as Assistant Professor of Law at Gujarat National Law University, Gandhinagar, Gujarat. She has attended/participated in various conferences/seminars and workshops. She has been part of the National Consultation on Evolving a Curriculum Framework for Law, Poverty and Development Courses in Law School’s organised by Centre for Social Justice, 2013.

She was a member of the High Court Legal Services Committee. She has delivered guest lectures at the Gujarat State Judicial Academy, 2011. She was the ‘Consultations Coordinator,’ Western Zone on “Consultation on Protection of Children from Sexual Offences Bill, 2011” organised at GNLU and participated in the National Level Consultations organised at NLU, Delhi in association with NCPCR, 2011. She has been the resource person on “Vertical Interaction Course for Prison Officers”, in collaboration with I.G. Prisons, Gujarat & BPRD, Ministry of Home Affairs, Government of India. She has conducted Police Training Programmes sponsored by BPRD, New Delhi in association with GNLU. Coordinated the training program of “Human Rights in Prison Management” organised in association with BPRD, 2011. She was a Judge for Stetson Law Moot Court Competition.`;

    const [somaResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Dr. Soma Battacharjya',
        'soma-battacharjya',
        'Assistant Professor',
        'https://dsnlu.ac.in/storage/2022/12/Dr.-Soma.jpg',
        'M.A., LL.M.',
        '',
        '',
        'Assistant Professor of Law, Damodaram Sanjivayya National Law University',
        'Criminal Law, Indian History & Culture, Human Rights, Juvenile Justice',
        somaBio,
        'regular'
      ]
    );
    const sId = somaResult.insertId;

    // Meta
    const somaMeta = [
      ['Awards & Fellowships', 'Gold Medal in Law Graduation | Distinction and Gold Medal in Post Graduation (Criminal Law Specialisation) | UGC-NET Qualified', 'other', 1],
      ['Committee Memberships', 'Member of the High Court Legal Services Committee', 'leadership', 2],
      ['Training & Coordination', 'Consultations Coordinator, Western Zone (POCSO Bill, 2011) | Resource Person for "Vertical Interaction Course for Prison Officers" | Coordinator for "Human Rights in Prison Management"', 'leadership', 3]
    ];
    for (let m of somaMeta) {
      await pool.query(`INSERT INTO faculty_research_meta (faculty_id, meta_key, meta_value, type, display_order) VALUES (?, ?, ?, ?, ?)`, [sId, ...m]);
    }

    // Previous Experience
    const somaExp = [
      ['Assistant Professor of Law', 'Gujarat National Law University, Gandhinagar, Gujarat', '', 'teaching', 1]
    ];
    for (let exp of somaExp) {
      await pool.query(`INSERT INTO faculty_experience (faculty_id, title, institution, period, type, display_order) VALUES (?, ?, ?, ?, ?, ?)`, [sId, ...exp]);
    }

    // 7. Dr. N. Bhagya Lakshmi
    console.log('Seeding Dr. N. Bhagya Lakshmi...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['n-bhagya-lakshmi']);
    
    const bhagyaBio = `Dr. N. Bhagya Lakshmi was appointed as a Teaching Associate in 2014 and was subsequently recruited as an Assistant Professor in 2024. She practiced as an Advocate for fourteen years (1999–2014) at the Visakhapatnam and Srikakulam Bar Associations, handling both civil and criminal matters, with a primary focus on matrimonial disputes and their reconciliation. She completed her five-year LL.B. degree from MPR Law College, Srikakulam. She pursued her LL.M. from Andhra University with a specialization in Criminal Law. She was awarded a Ph.D. by Andhra University, Visakhapatnam, for her doctoral thesis titled “Matrimonial Dispute Resolution in India through ADR Methods: A Socio-Legal Study with Reference to Visakhapatnam Family Court.” She was Awarded Sri Peri Narayana Murty Memorial Gold Medal for merit in PhD (Best Thesis Award).

Area of Specialization: Criminal Law

Subjects Taught: Civil Procedure Code, 1908, Law of Insurance, Drafting, Pleading and conveyancing, Law and Poverty, Infrastructure Law, Comparative Public Law, Disaster Management, ADR Clinical Paper`;

    const [bhagyaResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Dr. N. Bhagya Lakshmi',
        'n-bhagya-lakshmi',
        'Assistant Professor',
        'https://dsnlu.ac.in/storage/2022/12/Dr.-N.-Bhagya-lakshmi.jpg',
        'M.A, LL.M., Ph.D. (Gold Medallist in PhD)',
        '',
        'bhagyasri.n@dsnlu.ac.in',
        'Assistant Professor of Law, Damodaram Sanjivayya National Law University',
        'Criminal Law, Civil Procedure Code, Law of Insurance, ADR',
        bhagyaBio,
        'regular'
      ]
    );
    const blId = bhagyaResult.insertId;

    // Meta (Awards & Delivered Lectures)
    const bhagyaMeta = [
      ['Awards', '‘Merit award’ from Anakapalli Collector on 26.01.2026 | Sri Peri Narayana Murty Memorial Gold Medal for merit in PhD (Best Thesis Award) for AY 2018-19 | Indian Glory Award 2021 for ‘Contribution to Student Development’ | ‘Best Paper Presentation Award’ in 4th National Symposium (University of Allahabad)', 'other', 1],
      ['Executive Roles', 'Nominated as member of Executive Council of DSNLU from 19.12.2024 for a period of one year.', 'leadership', 2],
      ['Selected Lectures Delivered', 'Guest Speaker in 5-day Research Methodology workshop (AGNEL School of Law, Mumbai, 2025) | Resource person at NLUO Workshop (Tobacco Exposure, 2025) | Speaker on "Arbitration clauses in agreements & Mediation" (Broadridge Financial Solutions, 2023) | Resource Person for GST Training (NACIN, Zonal Campus, Visakhapatnam) | Resource Person in UNDP International Conference (NLUO, 2017) | Resource Person for NALSA National Seminar (New Delhi, 2017)', 'leadership', 3]
    ];
    for (let m of bhagyaMeta) {
      await pool.query(`INSERT INTO faculty_research_meta (faculty_id, meta_key, meta_value, type, display_order) VALUES (?, ?, ?, ?, ?)`, [blId, ...m]);
    }

    // Experience
    const bhagyaExp = [
      ['Advocate', 'Visakhapatnam and Srikakulam Bar Associations', '1999–2014', 'other', 1],
      ['Teaching Associate', 'Damodaram Sanjivayya National Law University', '2014–2024', 'teaching', 2],
      ['Assistant Professor', 'Damodaram Sanjivayya National Law University', '2024–Present', 'teaching', 3]
    ];
    for (let exp of bhagyaExp) {
      await pool.query(`INSERT INTO faculty_experience (faculty_id, title, institution, period, type, display_order) VALUES (?, ?, ?, ?, ?, ?)`, [blId, ...exp]);
    }

    // Publications
    const bhagyaPubs = [
      // Books
      ['book', 'Beyond the Court Room: ADR in Matrimonial Disputes', 'Tejaswi Astitva Publications', '2025', 'ISBN: 2456-5598', 1],
      ['book', 'Mediation in Black Coat', 'LAMBERT Academic Publishing', '2024', 'ISBN: 9786208419288', 2],
      // Articles & Chapters
      ['article', 'From #HashTag to Havoc: Influence of Social Media on Violence', 'Social Media & Violence against Women, TNDALU, Bengaluru', '2025', 'ISBN 978-81-982543-3-7', 3],
      ['article', 'Life Without Parole: A Humane Alternative to Capital Punishment', 'Global Convergence Conference Publication, University of Colombo', '2025', 'ISBN 978-624-5518-40-1', 4],
      ['article', 'Disability-Based Violence: Invisible Issues and Challenges', 'Empowering the Marginalized, Bharathi Publications', '2024', 'ISBN 978-9348059772', 5],
      ['article', 'Parental Disharmony: Welfare of Unaccompanied Children', 'Child Rights and Protection, Bharathi Publications', '2024', 'ISBN 978-9348059994', 6],
      ['article', 'Videsi Yanam: Vivaha Vyavastha Gamanam (Telugu)', 'Diasporic Literature, HSRA Publications', '2024', 'ISBN 978-93-5506-912-2', 7],
      ['article', 'Emergence of Infrastructure Development and Impact on Environment', 'Beyond Green Complexities, Aequitas Victoria Foundation', '2024', 'ISBN 978-81-976379-5-7', 8],
      ['article', 'Matrimonial Discords: Amicable Dispute Resolution', 'Veritas Special Edition, Gitam', '2024', 'ISBN 978-81-975947-9-3', 9],
      ['article', 'Balyam Bhavithalo Balala Rakshana Chattalu: Pathra', 'Journal of Indian Law and Society (JILS), NUJS', '2024', 'ISSN 2277-5552', 10],
      ['article', 'Advertisements and Consumer Culture: Protection under Consumer Law', 'Consumer Law and Practice, NLSIU', '2023', 'ISBN 978939111021', 11],
      ['article', 'COVID-19 as a Disaster', 'Environmental Education Legislation and Disaster Management', '2023', 'ISBN 978939598648', 12],
      ['article', 'Gender Sensitivity: Need of the Hour', 'Human Rights and Gender Justice, Kerala Law Academy', '2023', 'ISBN 978-93-5578-165-9', 13],
      ['article', 'Infrastructure Resilience: An Emerging Issue of Disaster Risk Reduction', 'Disaster & Development, Vol.11 Issue 01 (UGC Cared)', '2022', 'ISSN 0973-6700', 14],
      ['article', 'Influence of Immigration on Child Welfare', 'Citizenship and Immigration Laws, Asia Law House', '2022', 'ISBN 878-83-94739-24-6', 15],
      ['article', 'Infrastructure Projects: A Way Forward to Smart Cities', 'INDIA@75 Azadi Ka Amrit Mahotsav E-Journal', '2022', 'ISBN 978-81-951173-8-3', 16],
      ['article', 'Judiciary Role in Upholding Access to Justice', 'XII National Online Conference Proceedings, CHRIST', '2022', 'ISBN 978-93-5626-995-8', 17],
      ['article', 'The #MeToo Movement in the Digital Era: Indian Perspective', 'Women’s Studies International Forum, Elsevier', '2022', 'ISSN 0277-5395', 18],
      ['article', 'Changing Facets of Matrimonial Bond', 'Family Law Prospects and Challenges, Satyam Law International', '2022', 'ISBN 978-93-91345-68-6', 19],
      ['article', 'Educationally Backward: Sign of Poverty', 'Global Issues of Poverty, Development & Population', '2022', 'ISBN 978-91-987581-0-8', 20],
      ['article', 'Crime Against Women & ADR', 'International Journal of Emerging Technologies', '2021', 'E-ISSN 2349-5162', 21],
      ['article', 'Education in Pandemic: Issues & Challenges', 'Research Journey International E-Research Journal', '2021', 'E-ISSN 2348-7143', 22],
      ['article', 'Psychological Effect of Divorce on Children', 'Law and Mental Health (Clinic to Community Care)', '', 'ISBN 978-81-954254-1-9', 23],
      ['article', 'An Overview on Unemployment', 'Employment Promotion in Rural India', '2021', 'ISBN 978-93-90390-60-1', 24],
      ['article', 'COVID 19 & Health: Issues and Perspectives', 'UBI SOCIETAS IBI IUS', '2021', 'ISBN 978-81-947316-3-4', 25],
      ['article', 'Universal Access to Education: Issues & Challenges in Rural India', 'Amity International Journal of Teacher Education', '', 'ISSN 2396-616X', 26],
      ['article', 'The Disembodied Womb: Mothering for Money', 'Surrogacy and ART in India, Satyam Law International', '', 'ISBN 978-93-87839-57-1', 27],
      ['article', 'Judiciary as Harbinger for Gender Equality', 'Perspectives on Gender Justice', '2020', 'ISBN 9798653618970', 28],
      ['article', 'Life or Livelihood during COVID 19', 'Tejasvi Astitva Research Journal', '2020', 'ISSN 2581-9070', 29],
      ['article', 'Detention of Undertrial Prisoners: A Bird’s Eye View', 'Pen Acclaims Journal, Vol.6', '2019', 'E-ISSN 2581-5504', 30],
      ['article', 'Dr. B R Ambedkar: A Ray of Hope of Marginalized People', 'Proceedings of National Conference on Ambedkarism', '2019', 'ISBN 9789388808286', 31],
      ['article', 'Chattam Badrathalo Mahila (Telugu Literature)', 'Tejasvi Astitva Research Magazine', '2019', 'ISSN 2581-9070', 32],
      ['article', 'Untouchability: Perception of Mahatma', 'International Conference on Gandhian Ideals', '2019', 'ISBN 9789386435972', 33],
      ['article', 'Tribes under the Shield of the Indian Constitution', 'Our Heritage Journal, Vol-67-Issue-2', '2019', 'ISSN 0474-9030', 34],
      ['article', 'Life Insurance: A Step Towards Family Security', 'International Conference on Insurance Law and Regulations', '2018', 'ISBN 9789388237437', 35],
      ['article', 'Honor Killing: Is it Pride for the Family?', 'International Journal of Legal Developments and Allied Issues', '', 'ISSN 2454-1273', 36],
      ['article', 'Marital Disharmony: Fate of Children', 'Journal of Juvenile & Family Law, Vol.I Issue.1', '2017', 'ISSN 2446-2101', 37],
      ['article', 'Women Empowerment in the Era of Dr. B.R. Ambedkar', 'International Journal of Academic Research', '2017', 'ISSN 2348-7666', 38],
      ['article', 'Ethnic & Legal Issues of Surrogacy in India', 'South Asian Law Review, Vol.3', '2017', 'ISSN 2456-7531', 39],
      ['article', 'Child Labour: The Constitutional Perspective', 'Journal of Rights of the Child, NLUO, Odisha', '2017', '', 40],
      ['article', 'Evolution of Social Network: Revolution in Family Network', 'Al Ameen Law Review, Vol.3', '2016', 'ISSN 2347-8624', 41],
      ['article', 'Irretrievable Breakdown of Marriage as a Ground for Divorce: Use or Abuse', 'Law and Society: A New Challenge, Vol.III No.1', '2016', 'ISSN 2348-4861', 42],
      ['article', 'Mediation: Marital Conflict Resolution Therapy', 'Bharathi Law Review, Vol.V Issue.2', '2016', 'ISSN 2278-6996', 43],
      ['article', 'Child Labour – Is it for Livelihood', 'Child Labour in India: Policy Initiatives', '2015', 'ISBN 978-93-83729-73-9', 44],
      ['article', 'Mutual Understanding vis-à-vis Mutual Consent', 'Indian Journal of Legal Philosophy, Vol.2 Issue.4(1)', '2014', 'ISSN 2347-4963', 45],
      ['article', 'Importance of Pre-marital Counselling', 'Journal of Legal Analysis and Research, Vol.1 Issue.4', '2014', 'ISSN 248-456X', 46]
    ];
    for (let pub of bhagyaPubs) {
      await pool.query(`INSERT INTO faculty_publications (faculty_id, type, title, journal_book_name, year, details, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [blId, ...pub]);
    }

    // Conferences
    const bhagyaConfs = [
      ['The Silent Crisis: Socio Legal impediments to Elderly well-being', 'Khordha Law College, Khordha', 'March 2025', 'national', 'Presented Paper', 1],
      ['Artificial Intelligence: A Promising Tool For Social Empowerment', 'TSCLD', 'April 2025', 'national', 'Presented Paper', 2],
      ['From #HashTag to Havoc: Influence of Social Media on Violence', 'International Conference on Law and Social Sciences', 'March 2025', 'international', 'Presented Paper', 3],
      ['Technology as a Pattern of Crime vis-à-vis Crime Prevention Strategy', 'University of Jayawardanepura, Sri Lanka', 'Oct 2024', 'international', 'Presented Paper', 4],
      ['Emergence of Infrastructure Development and Impact on Environment', 'KLEF College of Law', 'Sept 2024', 'international', 'Presented Paper', 5],
      ['From Knowledge to Action: Empowering Consumers with Legal Rights', 'Shankarrao Chavan Law College, Pune', 'Aug 2024', 'national', 'Presented Paper', 6],
      ['Disability Based Violence: Invisible Issues', 'HPNLU, Shimla', 'Jan 2024', 'international', 'Presented Paper', 7],
      ['Role of Judiciary in Unfolding Gender Discrimination', 'NLIU, Bhopal', 'April 2024', 'national', 'Presented Paper', 8],
      ['VidesiYanam: Vivaha Gamanam', 'AU TDR HUB (Telugumalli, Australia)', 'March 2024', 'international', 'Presented Paper', 9],
      ['The Emergence of Artificial intelligence: Peril to Human Rights', 'ICFAI Law School, Hyderabad', 'Nov 2023', 'national', 'Presented Paper', 10],
      ['Mahatma’s Inspiration: Women in Freedom Movement', 'Andhra University', 'Oct 2023', 'international', 'Presented Paper', 11],
      ['Challenges & Issues of Consumers: Protection Laws', 'ICFAI University, Jharkand', 'Aug 2023', 'national', 'Presented Paper', 12],
      ['Nexus between Extreme Poverty and Human Trafficking', 'Jagran Lakecity University', 'March 2023', 'national', 'Presented Paper', 13],
      ['Live-In Relationship: Walk in or Walk Out – Protection Under Law', 'DSNLU', 'March 2023', 'national', 'Presented Paper', 14],
      ['Adivasi Displacement vis-a-vis Infrastructure Projects', 'DSNLU', 'Feb 2023', 'national', 'Presented Paper', 15],
      ['Impact of Movies on Youth & Attitude Towards Society', 'Jyoti Nivas College, Bangalore', 'Jan 2023', 'international', 'Presented Paper', 16],
      ['Electricity Sector: Issues and Challenges', 'MNLU, Nagpur', 'July 2022', 'international', 'Presented Paper', 17],
      ['Parental Disharmony: ‘Welfare’ of Unaccompanied Children', 'Law Mantra, ILI, MNLU', 'July 2022', 'international', 'Presented Paper', 18],
      ['Reconceptualization of ‘Right to Residence’ under the Domestic Violence Act', 'Symbiosis Law School, Nagpur', 'March 2022', 'national', 'Presented Paper', 19],
      ['Highway Projects: Issues & Dispute Resolution', 'CADR, DSNLU', 'March 2022', 'international', 'Presented Paper', 20],
      ['Social Media: Legal Framework', 'Kerala Law Academy', '2022', 'international', 'Presented Paper', 21],
      ['Judiciary role in upholding Access to Justice', 'CHRIST University', 'Jan 2022', 'national', 'Presented Paper', 22],
      ['Gender Sensitivity: Need of the Hour', 'Kerala Law Academy', 'Dec 2021', 'international', 'Presented Paper', 23],
      ['Covid 19 & Health: Issues & Perspectives', 'University of Allahabad (Best Presentation Award)', 'Jan 2021', 'national', 'Presented Paper', 24],
      ['Universal Access to Education and Rural India', 'Amity University Uttar Pradesh', 'Feb 2021', 'national', 'Presented Paper', 25],
      ['Issues in Road Construction Projects: Dispute Resolution Process', 'Adani Institute of Infrastructure', 'Feb 2021', 'international', 'Presented Paper', 26],
      ['Penury as a factor in Human Trafficking', 'Law Mantra Trust, ILI', 'June 2021', 'international', 'Presented Paper', 27],
      ['Influence of Immigration on Child Welfare', 'Symbiosis Law School, Hyderabad', 'May 2020', 'national', 'Presented Paper', 28],
      ['COVID-19: PARADOXICAL SITUATION VIS A VIS FOOD SECURITY', 'Asian Law College', 'Oct 2020', 'national', 'Presented Paper', 29],
      ['Nuptial Disharmony: Attorney as a Mediator', 'MNLU, Nagpur', 'Oct 2020', 'national', 'Presented Paper', 30],
      ['Zero FIR: A Precious Right of Women', 'Acharya Nagarjuna University', 'Feb 2020', 'national', 'Presented Paper', 31],
      ['Professional Negligence in Medico-Legal Cases', 'GITAM School of Law', 'Feb 2020', 'national', 'Presented Paper', 32],
      ['Judiciary as Harbinger for Gender Equality', 'Centre for Legal Research and Studies Jaipur', 'April 2020', 'international', 'Presented Paper', 33],
      ['Life or Livelihood during Covid-19', 'Tejasvi Astitva Foundation', 'May 2020', 'international', 'Presented Paper', 34],
      ['Life Insurance: A step towards family security', 'ICFAI Law School, Hyderabad', 'Feb 2019', 'international', 'Presented Paper', 35],
      ['Paryavarana Parirakshana: Haritha Chattalu', 'Adikavi Nannaya University', 'Feb 2019', 'international', 'Presented Paper', 36],
      ['Dr. B.R. Ambedkar: A Ray Hope for marginalized', 'Dr. VS Krishna Govt Degree College', 'July 2019', 'national', 'Presented Paper', 37],
      ['Chattam Badrathalo Mahila', 'Visakha Govt Degree College for Women', 'Sept 2019', 'national', 'Presented Paper', 38],
      ['Future of working child: Role of ILO', 'DSNLU', 'Sept 2019', 'national', 'Presented Paper', 39],
      ['Girl as a Victim of Acid Attacks', 'Asian Law College', 'Oct 2019', 'national', 'Presented Paper', 40]
    ];
    for (let conf of bhagyaConfs) {
      await pool.query(`INSERT INTO faculty_conferences (faculty_id, title, details, date, type, role, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [blId, ...conf]);
    }

    // 8. Dr. Ch. Lakshmi
    console.log('Seeding Dr. Ch. Lakshmi...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['ch-lakshmi']);
    
    const chlBio = `Dr Lakshmi Chebolu is a Graduate from Commerce and pursued Legal studies at Andhra University, Visakhapatnam. She has 27 years of teaching experience in Law. She teaches Public International Law, International Human Rights Law and International Humanitarian Law, Law of Contracts, Labour Laws, and Women and Child Laws. She specialized in Business Laws and secured First Class in M.L. Her Doctoral thesis titled ‘International Humanitarian Law and Protection of Women from Sexual Violence in Armed Conflicts’ was awarded the ‘Peri Narayana Murthy’ Gold Medal for the best PhD thesis in law, Andhra University in the year 2014, and recipient of Dr. Sarvepalli Radha Krishnan Memorial Award-2020- “The Most Evocative Teacher”, from Tejasvi Astitva Foundation, NGO, Delhi. She has a Life Membership in the International Institute of Humanitarian Law, San Remo, Italy. She published various Articles and presented papers in National and International Seminars, attended Workshops and had given numerous Guest Lectures. She was invited for many Radio Talks on Legal Awareness programs conducted by All India Radio (AIR), Visakhapatnam.`;

    const [chlResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Dr. Ch. Lakshmi',
        'ch-lakshmi',
        'Assistant Professor',
        'https://dsnlu.ac.in/storage/2022/12/Dr.-Ch.Lakshmi.jpg',
        'B.Com., M.L., PhD Law.',
        '',
        'chlakshmi197@dsnlu.ac.in',
        'Assistant Professor of Law, Damodaram Sanjivayya National Law University',
        'Public International Law, Human Rights, Humanitarian Law, Labour Laws, Women & Child Laws',
        chlBio,
        'regular'
      ]
    );
    const chlId = chlResult.insertId;

    // Meta (Awards & Memberships)
    const chlMeta = [
      ['Awards', '‘Peri Narayana Murthy’ Gold Medal for best PhD thesis in law (Andhra University, 2014) | Dr. Sarvepalli Radha Krishnan Memorial Award-2020- “The Most Evocative Teacher” (Tejasvi Astitva Foundation)', 'other', 1],
      ['Memberships', 'Life Membership in the International Institute of Humanitarian Law, San Remo, Italy', 'other', 2],
      ['Guest Lectures & Talks', 'Invited for many Radio Talks on Legal Awareness by All India Radio (AIR), Visakhapatnam', 'leadership', 3]
    ];
    for (let m of chlMeta) {
      await pool.query(`INSERT INTO faculty_research_meta (faculty_id, meta_key, meta_value, type, display_order) VALUES (?, ?, ?, ?, ?)`, [chlId, ...m]);
    }

    // Courses & Training
    const chlCourses = [
      ['Online One-Week FDP on "Research Design & Research Method"', 'TLC Ramanujan College (PMMMNMTT)', '2022', 'national', 'Attended', 1],
      ['Two-week Refresher Course on "Law in Contemporary Times"', 'TLC Ramanujan College (PMMMNMTT)', '2022', 'national', 'Attended', 2],
      ['National Level FDP on "Transformation in Indian Education through NEP"', 'Government First Grade College for Women, Mangaluru', '2021', 'national', 'Attended', 3],
      ['Seven Day Online FDP on "Human Rights in Contemporary India"', 'Centre for Human Rights, HPNLU', '2021', 'national', 'Attended', 4],
      ['Eight-day International Online Legal FDP', 'Kristu Jayanti College of Law, Bangalore', '2020', 'international', 'Attended', 5],
      ['One week International FDP on "Enhancing Digital Proficiency"', 'Adikavi Nannaya University', '2020', 'international', 'Attended', 6],
      ['Eleven Days FDP on "Online Teaching & Learning Methods"', 'DSNLU', '2020', 'national', 'Attended', 7],
      ['Short Term Course on ‘Women Studies’', 'UGC- HRDC, Andhra University', '2020', 'national', 'Attended', 8],
      ['Legal Research Methodology FDP', 'GITAM Law School', '2019', 'national', 'Attended', 9],
      ['15th South Asian Teaching Session International Humanitarian Law', 'Andhra University & ICRC', '2009', 'international', 'Participated', 10]
    ];
    for (let c of chlCourses) {
      await pool.query(`INSERT INTO faculty_conferences (faculty_id, title, details, date, type, role, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [chlId, ...c]);
    }

    // Publications
    const chlPubs = [
      // Articles
      ['article', 'The World’s Forgotten Victims: With Special Reference to Climate Change', 'National Journal of Environmental Law, Vol.6, Issue.2', '2023', 'ISSN: 2581-6683', 1],
      ['article', 'Access To Justice: A Special Emphasis On Corporate Human Rights Abuses', 'Indian Journal of Law And Legal Research, Volume V Issue IV', '2023', 'ISSN: 2582-8878', 2],
      ['article', 'Artificial Intelligence in The Digital Market – Legal Regime: An Overview', 'Indian Journal of Law and Legal Research, Volume IV Issue I', '2022', 'ISSN: 2582-8878', 3],
      ['article', 'Contemporary Challenges of Law of Armed Conflicts', 'VBCL Law Review (Special Edition)', '2020', 'ISSN: 245-0480', 4],
      ['article', 'COVID-19 – Plight of Labour', 'Tejasvi Astitva', '2020', 'ISSN: 2581-9070', 5],
      ['article', 'Çovid-19 – Bioterrorism', 'International Journal of Law, Management & Humanities, Vol 3, Issue 2', '2020', 'ISSN: 2581-5369', 6],
      ['article', 'Iron Lady and Her Strive for Peace in Manipur', 'Tejasvi Astitva', '2019', 'ISSN: 2581-9070', 7],
      ['article', 'The Legal Quest for Gender Equality with reference to Women’s status in Globalized World', 'The IUP Law Review, Vol.9 No.1', '2019', 'ISSN: 2231-3095', 8],
      ['article', 'Environmental Degradation and its effect on Human Rights', 'Tejasvi Astitva', '2018', 'ISSN: 2581-9070', 9],
      ['article', 'The Role of International Criminal Court to Promote and Protect International Humanitarian Law', 'SAJLHR, Vol.3', '2018', 'ISSN: 2518-6159', 10],
      ['article', 'Right to Make Protective Choices and Personal Liberty of Women under Indian Constitution', 'Amity Law Journal', '2016', 'ISSN: 2395-4019', 11],
      ['article', 'Plight of Women in War', 'Imperial Journal of Interdisciplinary Research, Vol.2, issue-3', '2016', 'ISSN: 2454-1362', 12],
      ['article', 'Application of International Humanitarian Law in India', 'ALT', '2014', '', 13],
      ['article', 'Application of International Law in India: An Appraisal', 'The IUP Law Review, vol.IV,No.2', '2014', 'ISSN: 2231-3095', 14],
      ['article', 'Effect of Explosive Remnants of War on Women', 'The IUP Law Review, vol.III', '2013', 'ISSN: 2231-3095', 15],
      ['article', 'Protection of Women in International Humanitarian Law', 'JAJS 2', '2013', '', 16],
      ['article', 'Violence Against Women', 'AUJL (5&6)', '2012', '', 17],
      // Book Chapters
      ['article', 'Sustainability for future Generations: With Special Reference to Right to Healthy Environment', 'Beyond Green Complexities', '2024', 'ISBN: 978-81976379-5-7', 18],
      ['article', 'Water as a Human Right with Special Reference to Children', 'Managing the Blue', '2022', 'ISBN: 978-81-954254-0-2', 19],
      ['article', 'Gender Based Violence and its Effect on Women’s Mental Health', 'Law and Mental Health, DSNLU', '2021', 'ISBN: 978-81-954254-1-9', 20],
      ['article', 'The Role of Law in Autonomy of Children from Employment', 'Contemporary Issues Relating to Women and Child', '2021', 'ISBN: 978-93-91002-79-4', 21],
      ['article', 'Cyber Crimes- Women and Girl Child Safety-Legal Regime', 'Women in Contemporary India-Issues and Challenges', '2021', 'ISBN: 978 93-87-047-53-2', 22],
      ['article', 'Human Rights in World Courts', 'Emerging Dimensions of Human Rights in the Contemporary Era', '2021', 'ISBN: 978-93-87047-43-3', 23],
      ['article', 'Cultural Relativism and Its Effect on Modern Women Rights with a Special Emphasis on Martial Rape', 'Women’s Development in Post Globalization Era', '2020', 'ISBN: 978-93-83729-40-1', 24],
      ['article', 'Ambedkar’s Ideology under Indian Constitution: A Special Emphasis on Women’s Rights', 'Relevance of Ambedkarism for social transformation in contemporary India', '2019', 'ISBN: 978-93-88808-28-6', 25],
      // Edited Books
      ['book', 'Law and Mental Health (Associate Editor)', 'DSNLU', '2021', 'ISBN: 978-81-954254-1-9', 26]
    ];
    for (let pub of chlPubs) {
      await pool.query(`INSERT INTO faculty_publications (faculty_id, type, title, journal_book_name, year, details, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [chlId, ...pub]);
    }

    // Conferences, Lectures & Workshops (Adding to Conferences table)
    const chlConferences = [
      // Int. Conferences
      ['Usage of Artificial Intelligence and Machine Learning in Military Operations – State Responsibility', 'University of Nairobi Law School et al.', 'Dec 2024', 'international', 'Presented Paper', 11],
      ['Indian Constitutional Feminism: A Comparative Study', 'Rajiv Gandhi National University of Law, Punjab', 'Nov 2024', 'international', 'Presented Paper', 12],
      ['Sustainability for future Generations: With Special Reference to Right to Healthy Environment', 'KLEF College of Law & Aequitas Victoria Research Centre', 'Sept 2024', 'international', 'Presented Paper', 13],
      ['Wars- Weapons – State Responsibility', 'Jagran Lakecity University', 'March 2024', 'international', 'Presented Paper', 14],
      ['Raising The Age of Marriage For Indian Women-A Boon Or A Bane? – A Critical Analysis', 'Alliance University, Bengaluru', 'March 2022', 'international', 'Presented Paper', 15],
      ['Plight of Women in War', 'Andhra University', 'March 2014', 'international', 'Presented Paper', 16],
      ['COVID-19 – Plight of Labour', 'Tejasvi Astitva, New Delhi', 'May 2020', 'international', 'Presented Paper', 17],
      ['Contemporary Challenges of Law of Armed Conflicts', 'Vaikunta Baliga College of Law, Udupi', 'July 2020', 'international', 'Presented Paper', 18],
      ['Role of Legal Service Authorities Act in Implementation of Social Justice', 'Andhra University', 'Jan 2013', 'international', 'Presented Paper', 19],
      // National Conferences
      ['Substance Abuse and the need for community Intrusion', 'Acharya Nagarjuna University', 'March 2024', 'national', 'Presented Paper', 20],
      ['Right to Non-Marital Cohabitation: A Socio-Legal Issue', 'DSNLU', 'March 2023', 'national', 'Presented Paper', 21],
      ['The World’s Forgotten Victims: With special reference to Climate Change', 'Andhra University', 'Nov 2022', 'national', 'Presented Paper', 22],
      ['Effects of impurities in water on Children’s Health: An Overview', 'DSNLU', 'Sept 2021', 'national', 'Presented Paper', 23],
      ['Covid-19 and Legal Aspects of Migrant Workers', 'Acharya Nagarjuna University', 'March 2021', 'national', 'Presented Paper', 24],
      ['Labour Reforms in India in Post COVID-19 Era', 'RMLNLU, Lucknow', 'Aug 2020', 'national', 'Participated', 25],
      ['Aero Space and Defence Laws Lecture Series', 'NALSAR', 'July 2020', 'national', 'Participated', 26],
      ['Insight into the Consumer Protection Act, 2019', 'ICFAI Law School, Jaipur', 'June 2020', 'national', 'Participated', 27],
      ['Gender Based Violence and Legal Education', 'Visakha Govt Degree College for Women', 'Nov 2019', 'national', 'Presented Paper', 28],
      ['The Role of ILO in Nurturing Young Lives', 'DSNLU', 'Sept 2019', 'national', 'Presented Paper', 29],
      ['Iron Lady and Her Strive for Peace in Manipur', 'TejasviAstitva and Govt. Degree College for women', 'Sept 2019', 'national', 'Presented Paper', 30],
      ['Ambedkar’s Ideology under Indian Constitution: A Special Emphasis on Women’sRights', 'ICSSR and V.S.Krishna Government Degree College', 'July 2019', 'national', 'Presented Paper', 31],
      ['Mental health care act, 2017', 'DSNLU', 'March 2019', 'national', 'Presented Paper', 32],
      ['Women’s status in Globalized world', 'Andhra University', 'Oct 2018', 'national', 'Presented Paper', 33],
      ['Ease of Living, Economic Development and Environmental Degradation', 'Andhra University', 'Oct 2018', 'national', 'Presented Paper', 34],
      ['Law as an Instrument of Social Change with Reference to Judicial Interpretation', 'Andhra University', 'Sept 2018', 'national', 'Presented Paper', 35],
      ['States Obligation Towards Refugees under International Law', 'Sri Padmavati Mahila Visvavidyalam', 'March 2018', 'national', 'Presented Paper', 36],
      ['Environment 2017', 'National Green Tribunal', 'Sept 2017', 'national', 'Participated', 37],
      ['Judicial Accountability in protection of human rights: An Appraisal', 'Christ University, Bangalore', 'Sept 2017', 'national', 'Presented Paper', 38],
      ['Need for Women Empowerment in Conflict Zones', 'AIU & Maulana Azad National Urdu University', 'Sept 2016', 'national', 'Presented Paper', 39],
      ['Social Security as an aspect of Life and Liberty', 'Andhra University', 'March 2016', 'national', 'Presented Paper', 40],
      ['Corporate Social Responsibility to Protect Women’s Rights', 'Andhra University', 'March 2013', 'national', 'Presented Paper', 41],
      ['Consumer Protection – International Prospectives', 'Andhra University', 'Aug 2010', 'national', 'Presented Paper', 42],
      ['Violence Against Women', 'Andhra University', 'Feb 2010', 'national', 'Presented Paper', 43],
      // Workshops
      ['Virtual International Symposium', 'Maharashtra National Law University, Mumbai', 'May 2024', 'international', 'Participated', 44],
      ['Combating Human Trafficking: Role of Human Rights Institutions', 'HNLU', 'Dec 2021', 'national', 'Participated', 45],
      ['Awareness of Intellectual Property Rights', 'Shivaji University, Kolhapur', 'May 2020', 'national', 'Participated', 46],
      ['Contemporary Issues in Criminal Procedural Laws', 'GITAM School of Law', 'March 2019', 'national', 'Participated', 47],
      ['Companies Act, 2013; New Vista For Corporate Accountability', 'Indian Institute of Corporate Affairs', 'Dec 2013', 'national', 'Participated', 48],
      // Guest Lectures (Added as role = Resource Person/Guest Speaker)
      ['The Sexual Harassment of Women at Workplace Act, 2013', 'ICC, Railways (Waltair Division)', 'Dec 2024', 'national', 'Guest Speaker', 49],
      ['Domestic Violence & Women’s Rights', 'Controller of Naval Armament Inspection(East)', 'July 2024', 'national', 'Guest Speaker', 50],
      ['Women’s Day Celebrations', 'Govt. Degree College, Madugula', 'March 2023', 'national', 'Key Note Speaker', 51],
      ['Constitutional Safeguards to Protect Indian Citizens', 'Rotary Club, Visakhapatnam', 'Feb 2023', 'national', 'Chief Guest', 52],
      ['Indian Constitution in our daily life', 'Jana Shikshan Sansthan, Visakhapatnam', 'Nov 2022', 'national', 'Chief Guest', 53],
      ['Covid-19 Challenges, Preparedness & Management', 'Mother Teresa Women’s University', 'Oct 2020', 'international', 'Resource Person', 54],
      ['Gender Based Violence and Legal Education', 'Visakha Govt Degree P.G. College for Women', 'Nov 2019', 'national', 'Resource Person', 55],
      ['Sexual harassment at work place (Radio Talk)', 'All India Radio (AIR)', 'July 2019', 'national', 'Guest Speaker', 56],
      ['Gender Equality And Women Empowerment', 'B.V.K.Degree College, Visakhapatnam', 'March 2018', 'national', 'Guest Lecture', 57],
      ['Contract Act: Legal Options', 'Forum of Legal Professionals, Visakhapatnam', 'Dec 2017', 'national', 'Resource Person', 58],
      ['Women in Constitution of India: An Awareness', 'Bharati Seva Samiti, Visakhapatnam', 'Nov 2014', 'national', 'Resource Person', 59],
      ['Judicial Activism and Human rights', 'St.Joseph’s College for Women, Visakhapatnam', 'Feb 2014', 'national', 'Guest Lecture', 60],
      ['Girl Child and their rights', 'AVN Degree College', 'Dec 2013', 'national', 'Guest Lecture', 61]
    ];
    for (let c of chlConferences) {
      await pool.query(`INSERT INTO faculty_conferences (faculty_id, title, details, date, type, role, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [chlId, ...c]);
    }

    // 9. Dr. A. Nageswar Rao
    console.log('Seeding Dr. A. Nageswar Rao...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['a-nageswar-rao']);
    
    const nagBio = `Dr. Nageswara Rao Aienaparthi is currently serving as an Assistant Professor of Law at Damodaram Sanjivayya National Law University (DSNLU), Visakhapatnam, Andhra Pradesh. He also holds the administrative position of Assistant Registrar (Administration & Establishment) at the same university. With over 18 years of teaching and academic experience, he has contributed extensively to legal education, research supervision, and academic administration.

Dr. Rao completed his Ph.D. in Law from Dr. B.R. Ambedkar College of Law, Andhra University (2018). His doctoral thesis titled “Breakdown of the Constitutional Machinery in the States under Article 356 – An Antithesis of Indian Federalism” critically examined Centre-State relations and constitutional governance in India. He obtained his LL.M. in Constitutional Law (2013) and LL.B. (2011) from Andhra University. He also holds M.A. degrees in History (2000) and Sociology (2018) from Andhra University, along with a B.Ed. from Acharya Nagarjuna University (2002). He qualified UGC-NET (2012) and AP & TS SET (2014).

Prior to joining DSNLU in October 2024, Dr. Rao served as Associate Professor and Head of the Department at the Bharath Institute of Law, under Bharath Institute of Higher Education and Research (2022–2024). He earlier worked as Associate Professor & Head, Faculty of Juridical Sciences at Rama University (2021–2022), where he also served as LLM Coordinator, Member of Academic Council, Board of Studies Member, and Associate Editor.

From 2016 to 2021, he served as Assistant Professor at N.V.P. Law College affiliated to Andhra University, where he also held responsibilities as Academic Coordinator and Examination In-Charge. He began his career as a school teacher (2002–2006) and later as a Lecturer in Law (2006–2008).

Dr. Rao’s areas of specialization include Constitutional Law, Administrative Law, Environmental Law, Criminal Law, and Human Rights. He has over 30 research articles published in UGC-CARE, Scopus-indexed, and peer-reviewed journals, along with 7 book chapters. He has authored three books.

He has presented research papers in more than 50 national and international seminars and conferences and has participated in several Faculty Development Programmes and ICSSR-sponsored workshops. Notably, he attended the ICSSR-sponsored Capacity Building Programme on “One India through Digital India” (2025).

Dr. Rao has significant research supervision experience, having guided 17 LL.M. dissertations and currently supervising 4 Ph.D. scholars. He has also served as Judge for National Moot Court Competitions, including events organized by Bharath Institute of Law (2023) and Dr. B.R. Ambedkar College of Law, Andhra University (2025). Additionally, he chaired a paper presentation session at the Rajiv Gandhi School of Intellectual Property Law, IIT Kharagpur (2025).`;

    const [nagResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Dr. A. Nageswar Rao',
        'a-nageswar-rao',
        'Assistant Professor',
        'https://dsnlu.ac.in/storage/2024/10/Dr.-A.-Nageswar-Rao-1.png',
        'M.A. (History), M.A. (Soc), LL.M., Ph.D.',
        '',
        '',
        'Assistant Professor of Law & Assistant Registrar (Administration & Establishment), DSNLU',
        'Constitutional Law, Administrative Law, Environmental Law, Criminal Law, Human Rights',
        nagBio,
        'regular'
      ]
    );
    const nagId = nagResult.insertId;

    // Meta (Research Guidance & Invited Roles)
    const nagMeta = [
      ['Administrative Role', 'Assistant Registrar (Administration & Establishment), DSNLU', 'leadership', 1],
      ['Research Guidance', 'Guided 17 LL.M. dissertations | Currently supervising 4 Ph.D. scholars', 'guidance', 2],
      ['Special Invitations & Roles', 'Judge for National Moot Court Competitions (Bharath Institute of Law & Andhra University) | Chaired session at Rajiv Gandhi School of Intellectual Property Law, IIT Kharagpur (2025)', 'leadership', 3]
    ];
    for (let m of nagMeta) {
      await pool.query(`INSERT INTO faculty_research_meta (faculty_id, meta_key, meta_value, type, display_order) VALUES (?, ?, ?, ?, ?)`, [nagId, ...m]);
    }

    // Experience
    const nagExp = [
      ['Associate Professor and Head of the Department', 'Bharath Institute of Law (BIHER)', '2022–2024', 'teaching', 1],
      ['Associate Professor & Head (Faculty of Juridical Sciences)', 'Rama University', '2021–2022', 'teaching', 2],
      ['Assistant Professor', 'N.V.P. Law College (Andhra University)', '2016–2021', 'teaching', 3],
      ['Lecturer in Law', '', '2006–2008', 'teaching', 4],
      ['School Teacher', '', '2002–2006', 'teaching', 5]
    ];
    for (let exp of nagExp) {
      await pool.query(`INSERT INTO faculty_experience (faculty_id, title, institution, period, type, display_order) VALUES (?, ?, ?, ?, ?, ?)`, [nagId, ...exp]);
    }

    // Publications (Books, Chapters, Articles)
    const nagPubs = [
      // Books
      ['book', 'Breakdown of the Indian Constitutional Machinery in the States under Article 356 Vol-I', '', '', 'ISBN 978-81-936251-8-7', 1],
      ['book', 'Breakdown of the Indian Constitutional Machinery in the States under Article 356 Vol-II', '', '', 'ISBN 978-81-936251-9-4', 2],
      ['book', 'Social Transformation Through Public Libraries and Legal Literacy', '', '', 'ISBN 978-81-947171-5-7', 3],
      // Book Chapters
      ['article', 'Human Rights Perspective of Gender Justice: A Critical View', 'ABS Books Publisher', '2022', 'ISBN: 978-93-94424-03-6', 4],
      ['article', 'Impact of Foreign Direct Investment on Insurance Sector in India', 'International Journal of Academic Research', '2017', 'ISBN: 2348-7666', 5],
      ['article', 'Gandhian Principles of Understanding Qualities of Management', 'Gandhian Philosophy: Its Relevance Today', '2017', 'ISBN 978-81-933370-3-5', 6],
      ['article', 'Gandhi as a Journalist to Establish Fair and Transparent Democracy', 'Gandhian Approach to Rural Development & Communication', '2017', 'ISBN: 978-81-934206-7-6', 7],
      ['article', 'Union-State Relations in India', 'International Journal of Multi-Disciplinary Empirical Research', '2016', 'ISBN No: 2349-7408', 8],
      ['article', 'Local Self Government and Devolution of Powers', 'International Journal of Multi-Disciplinary Empirical Research', '2016', 'ISBN NO: 2349-9656', 9],
      ['article', 'Prohibition of Child Labour in India: A Human Rights Perspective', 'Child Labour in India: Policy Initiatives', '2015', 'ISBN No.: 978-93-83729-73-9', 10],
      // Journal Articles
      ['article', 'Computer-Related Inventions: Implications for MSMEs, Startups, and Related Emerging Legal Issues in India', 'Tec Empresarial Journal (SCOPUS)', '2023', 'ISSN: 1659-2395', 11],
      ['article', 'Domestic Violence from a Human Rights Perspective: A Critic', 'International Journal of Law Management and Humanities', '2023', 'ISSN 2581-5369', 12],
      ['article', 'Patenting of Computer-Related Invention: An International framework with special reference to Japan, USA, and EU', 'Journal of Foundational Research (UGC Care)', '2023', 'ISSN: 2395-5635', 13],
      ['article', 'Automation of Banking in India by Information Technology – An Overview', 'Humanities and Social Science Studies (UGC Care)', '2023', 'ISSN: 2319-82', 14],
      ['article', 'Federalism in India: a shift from Cooperative Federalism to Competitive Federalism', 'Journal of Philosophy, Ravindra Bharati University', '2022', 'ISSN: 0973-0087', 15],
      ['article', 'Gender discrimination-present scenario in India', 'Madhya Bharti (UGC Care)', '2022', 'ISSN: 0974-0066', 16],
      ['article', 'Police Atrocities in India', 'Dogo Rangsang Research Journal (UGC Care)', '2022', 'ISSN: 2347-7180', 17],
      ['article', 'Comparative study in constitutional law: its need and scope with special reference to supreme court cases', 'Journal of Philosophy, Ravindra Bharati University', '2022', 'ISSN 0973-0087', 18],
      ['article', 'The Death Penalty It’s a Symptom a Culture a Violence: Not a Solution', 'Dogo Rangsang Research Journal (UGC Care)', '2022', 'ISSN: 2347-7180', 19],
      ['article', 'Protection of Women’s Rights under the Indian Legal System', 'Dogo Rangsang Research Journal (UGC Care)', '2022', 'ISSN 2347-7180', 20],
      ['article', 'Right to a Speedy Trial under Indian Constitution', 'Journal of Education, Ravindra Bharati University', '2022', 'ISSN 0972-7175', 21],
      ['article', 'A Study on Capital Punishment with its Punishment Theories', 'Journal of Education, Ravindra Bharati University', '2022', 'ISSN 0972-7175', 22],
      ['article', 'Judicial Delays in India: Causes & Remedies', 'Journal of Education, Ravindra Bharati University', '2022', 'ISSN 0972-7175', 23],
      ['article', 'An Analysis of Capital Punishment in India', 'Madhya Bharti (UGC Care)', '2022', 'ISSN: 0974-0066', 24],
      ['article', 'Encapsulated View on Criminal Procedure (Identification) Bill, 2022', 'Madhya Bharti (UGC Care)', '2022', 'ISSN: 0974-0066', 25],
      ['article', 'Child Rights Provided in India with Special Reference to Education', 'Madhya Bharti (UGC Care)', '2022', 'ISSN: 0974-0066', 26],
      ['article', 'Right to Private Defence under Indian Criminal Law', 'Madhya Bharti (UGC Care)', '2022', 'ISSN: 0974-0066', 27],
      ['article', 'Media Trial, Fair Trial, and Procedural Justice', 'Madhya Bharti (UGC Care)', '2022', 'ISSN: 0974-0066', 28],
      ['article', 'Crime Against Children with Relevant Case Laws in India', 'Madhya Bharti (UGC Care)', '2022', 'ISSN: 0974-0066', 29],
      ['article', 'The Rights of Prisoners in India', 'Madhya Bharti (UGC Care)', '2022', 'ISSN: 0974-0066', 30],
      ['article', 'Theories of punishment – a socio-legal view', 'Madhya Bharti (UGC Care)', '2022', 'ISSN: 0974-0066', 31],
      ['article', 'A critical analysis of human trafficking in India', 'Dogo Rangsang Research Journal (UGC Care)', '2022', 'ISSN 2347-7180', 32],
      ['article', 'Marital rape: Indian paradox', 'Madhya Bharti (UGC Care)', '2022', 'ISSN: 0974-0066', 33],
      ['article', 'Rights of transgender- a human rights perspective', 'Madhya Bharti (UGC Care)', '2022', 'ISSN: 0974-0066', 34],
      ['article', 'Third-degree torture perpetrated by police-gross violates human rights in India', 'Dogo Rangsang Research Journal', '2022', 'ISSN 2347-7180', 35],
      ['article', 'Freedom of speech and expression vs social media violations', 'Dogo Rangsang Research Journal', '2022', 'ISSN 2347-7180', 36],
      ['article', 'Role of Government and the Judiciary to prevent social media violations in India', 'Dogo Rangsang Research Journal', '2022', 'ISSN 2347-7180', 37],
      ['article', 'Break down of Constitutional Machinery in the States- Judicial Review of Art 356', 'Journal Chronicle of Humanities and Cultural Studies', '2018', 'ISSN:2454-5503', 38],
      ['article', 'Judiciary-Protection of Environment and Sustainable Development', 'International Journal of Multi-Disciplinary Advanced Research Trends', '2017', 'ISSN NO:2349-7408', 39],
      ['article', 'Dr. Ambedkar Democracy and Political Vision in Reality', 'International Journal of Academic Research', '2017', 'ISSN:2348-7666', 40]
    ];
    for (let pub of nagPubs) {
      await pool.query(`INSERT INTO faculty_publications (faculty_id, type, title, journal_book_name, year, details, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [nagId, ...pub]);
    }

    // Conferences (Presentations & Participations)
    const nagConferences = [
      // International Presentations
      ['Socio-environmental issues and sustainable development', 'Acharya Nagarjuna University, Guntur', 'March 2023', 'international', 'Presented Paper', 1],
      ['Cyber-crimes in the milieu of Covid-19: A study on provisions of IPC and IT Act', 'KLE Society’s Law College, Bengaluru', 'July 2021', 'international', 'Presented Paper', 2],
      ['Enhancing digital proficiency: Platform for refining the research and teaching skills', 'Adikavi Nannaya University', 'Aug 2020', 'international', 'Presented Paper', 3],
      ['Sustainable Development of Indian Environment; a Legislative Perspective', 'Sri Padmavathi Mahila Viswavidyalayam, Tirupati', 'Aug 2015', 'international', 'Presented Paper', 4],
      ['Gender issues Relating to Multilingual Education in Bridging World Wide', 'Andhra University, Visakhapatnam', 'Sept 2014', 'international', 'Presented Paper', 5],
      ['Indian Women Health and Educational Problems and Concerns', 'Andhra University, Visakhapatnam', 'March 2014', 'international', 'Presented Paper', 6],
      // National Presentations
      ['Protection of the environment and sustainable development-judicial perspective', 'Acharya Nagarjuna University, Guntur', 'March 2023', 'national', 'Presented Paper', 7],
      ['Political Empowerment of Women', 'Andhra University, Visakhapatnam', 'Oct 2018', 'national', 'Presented Paper', 8],
      ['Legal Education in India in 21st Century', 'Dr. B.R. Ambedkar College of Law, Andhra University', 'Sept 2018', 'national', 'Presented Paper', 9],
      ['Technology-based Violence Against Women', 'Andhra University, Visakhapatnam', 'March 2018', 'national', 'Presented Paper', 10],
      ['Dr.Ambedkar democracy and political vision in reality', 'SKSD Mahila Kalasala, Tanuku', 'March 2017', 'national', 'Presented Paper', 11],
      ['Social Justice Embedded in Indian Constitution', 'Andhra University, Visakhapatnam', 'March 2017', 'national', 'Presented Paper', 12],
      ['Salient Features of Sustainable Development an Analysis', 'Acharya Nagarjuna University, Guntur', 'March 2017', 'national', 'Presented Paper', 13],
      ['Ambedkar relevance on Social philosophy', 'Acharya Nagarjuna University, Guntur', 'March 2017', 'national', 'Presented Paper', 14],
      ['Impact of Foreign Direct Investment on Insurance Sector in India', 'SKSD Mahila Kalasala, Tanuku', 'March 2017', 'national', 'Presented Paper', 15],
      ['Gandhian concept of Non-violence', 'Andhra University, Visakhapatnam', 'Oct 2016', 'national', 'Presented Paper', 16],
      ['Plural Society in India', 'Dr.B.R.Ambedkar College of Law, Andhra University', 'March 2016', 'national', 'Presented Paper', 17],
      ['Constitutional Status of Minority in India', 'Andhra University, Visakhapatnam', 'March 2016', 'national', 'Presented Paper', 18],
      ['Constitutional Status of Girl Child in India', 'Andhra University, Visakhapatnam', 'Feb 2015', 'national', 'Presented Paper', 19],
      ['Consumers Awareness Problems in Rural Areas', 'Dr.B.R.Ambedkar College of Law, Andhra University', 'Jan 2015', 'national', 'Presented Paper', 20],
      ['Role of NGOs in Human Rights Perspectives', 'Dr.B.R. Ambedkar College of Law, Andhra University', 'April 2014', 'national', 'Presented Paper', 21],
      ['Restrictive Trade Practices and Registration of Agreement', 'Dr.B.R. Ambedkar College of Law, Andhra University', 'May 2013', 'national', 'Presented Paper', 22],
      ['Gandhian Principles of Understanding Qualities of Management', 'Andhra University, Visakhapatnam', 'March 2017', 'national', 'Presented Paper', 23],
      // Attended & Participations
      ['International Conference on ADR Mechanism & Procedures (Virtual)', 'NMIMS Hyderabad', 'May 2022', 'international', 'Participated', 24],
      ['Webinar on Soft Skills Strategies at Workplace', 'PSNA College of Engineering and Technology, Dindigul', 'June 2020', 'national', 'Participated', 25],
      ['National Seminar on Higher Education at Cross Roads', 'IIPM and Visakhapatnam Regional Unit', 'Oct 2015', 'national', 'Participated', 26],
      ['Contemporary Issues in Criminal Procedural Laws with References to Crimes against Women', 'GITAM School of Law, Visakhapatnam', 'March 2019', 'national', 'Participated', 27],
      ['Social Media in Empowerment of women', 'Kakatiya University, Warangal', 'Feb 2018', 'national', 'Participated', 28],
      ['Social Justice for Marginalized Communities', 'Andhra University', 'Feb 2017', 'national', 'Participated', 29],
      ['Scheduled Tribes: Issues and Perspectives for Development', 'Andhra University', 'Aug 2016', 'national', 'Participated', 30],
      ['Child Labour in India: Issues and Concerns', 'Andhra University', 'June 2015', 'national', 'Participated', 31],
      ['Senior Citizens Protection and Welfare', 'Andhra University', '', 'national', 'Participated', 32],
      ['Emerging Issues Relating to Trials, in Civil and Criminal Matters', 'Visakhapatnam Bar Association', '2015', 'national', 'Participated', 33]
    ];
    for (let c of nagConferences) {
      await pool.query(`INSERT INTO faculty_conferences (faculty_id, title, details, date, type, role, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [nagId, ...c]);
    }

    // 10. Dr. Rifat Khan
    console.log('Seeding Dr. Rifat Khan...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['rifat-khan']);
    
    const rifBio = `Dr. Rifat Khan is an Assistant Professor of Law at Damodaram Sanjivayya National Law University (DSNLU), Visakhapatnam, having joined in October 2024. She is a committed professional with over ten years of experience and a creative teacher with more than eight years of instructional experience. Dr. Rifat Khan holds a Ph.D in Law from Lovely Professional University, Punjab, where her research focused on the ‘Socio-Legal Dimensions of Drug Abuse Among Women in Kashmir’. She is UGC NET qualified and holds an LL.M. in Criminal Laws and an LL.B from the University of Kashmir, Srinagar.

Prior to her current role, she served as an Assistant Professor and Coordinator in Charge at the Department of Law, University of Calicut, Kerala. Her professional strengths include experience in the NAAC Accreditation process and managing and coordinating various academic activities at the department. During her tenure, she has mentored many students and guided post-graduation LL.M dissertations. She has taught multiple subjects including Criminal Law, Criminology, Penology and Victimology, Police and Security Administration, Narcotic and Psychotropic Substances Act, Constitutional Law, Legal Education and Research Methodology, Socio-Economic Offences, Law of Torts, Family Law etc.

Apart from being convenor and member of various academic Centres and Committees at DSNLU, she also is an active member of the Academic Council, the Admission Committee, the Examination Committee, and the Disciplinary Committee. She also is a member of Board of Studies (PG) for Law at University of Calicut, Kerala.`;

    const [rifResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Dr. Rifat Khan',
        'rifat-khan',
        'Assistant Professor',
        'https://dsnlu.ac.in/storage/2024/10/Dr.-Rifat-Khan.png',
        'M.A. (History), M.A. (Sociology), LL.M., B.Ed., Ph.D. in Law (NET, SET)',
        '',
        '',
        'Assistant Professor of Law, Damodaram Sanjivayya National Law University',
        'Criminal Law, Criminology, Penology and Victimology, Police and Security Administration, NDPS Act, Constitutional Law, Legal Education',
        rifBio,
        'regular'
      ]
    );
    const rifId = rifResult.insertId;

    // Meta (Consultancy & Additional Roles)
    const rifMeta = [
      ['Consultancy', 'Member of Directorate of Consultancy – Consultancy to approve draft MoU at University of Calicut, Thenhipalam, Kerala.', 'leadership', 1],
      ['Academic Committees', 'Active member of Academic Council, Admission Committee, Examination Committee, and Disciplinary Committee at DSNLU. Member of Board of Studies (PG) for Law at University of Calicut.', 'leadership', 2]
    ];
    for (let m of rifMeta) {
      await pool.query(`INSERT INTO faculty_research_meta (faculty_id, meta_key, meta_value, type, display_order) VALUES (?, ?, ?, ?, ?)`, [rifId, ...m]);
    }

    // Experience
    const rifExp = [
      ['Assistant Professor', 'Damodaram Sanjivayya National Law University (DSNLU)', 'October 2024 - Present', 'teaching', 1],
      ['Assistant Professor and Coordinator in Charge', 'Department of Law, University of Calicut, Kerala', '', 'teaching', 2]
    ];
    for (let exp of rifExp) {
      await pool.query(`INSERT INTO faculty_experience (faculty_id, title, institution, period, type, display_order) VALUES (?, ?, ?, ?, ?, ?)`, [rifId, ...exp]);
    }

    // Publications (Books, Chapters, Journals)
    const rifPubs = [
      // Books
      ['book', 'Evolving Constitutionalism and Contemporary Changes in India, Vol 1 (Edited Book)', 'IIP Iterative International Publishers', '2025', 'ISBN: 978-93-7020-377-8', 1],
      // Chapters
      ['article', 'Inter-Religious Marriages and its Current Scenario with Special Reference to Jammu and Kashmir', 'Inter-religious Understanding for Advancement of Human Right for All', '2022', 'ISBN: 978-93-9165909-7, pp. 149-156', 2],
      ['article', 'Gender, Genocide and Responsibility to Protect', 'Genocide and Ethnic Cleansing', '2020', 'ISBN: 978-93-85618-93-2, pp. 148', 3],
      ['article', 'Principles Governing Freedom of Religion, Administration of Justice and Politics in a Muslim Society', 'Emerging Dimensions of Human Rights in Contemporary Era', '', 'ISBN: 9787387047433, pp. 385', 4],
      ['article', 'Minority Status, Identity and Politics: a Doctrinal Study of the Criteria and Process for Granting Minority Status and its Socio-Political Consequences in Different States', 'National Conference on Constitutional Development, University of Madras', '2026', 'ISBN 978-93-47021-79-4, PP 224', 5],
      // Journals
      ['article', 'Age Of Consent and the Autonomy of Personal Laws: Analysing the Clash Between POCSO Act and Muslim Personal Law in India', 'Lex Localis-Journal of Local Self-Government, Vol. 22, No. 4', '2024', 'ISSN: 1581-5374, pp. 716-722', 6],
      ['article', 'Socio-Legal Impact of Surrogacy in India: An Analysis', 'NIU International Journal of Human Rights, Vol. 8 (IX)', '2021', 'ISSN: 2394-0298, pp. 40-48', 7],
      ['article', 'Criminalization of Drug Use: Legal Issues and Effects', 'Our Heritage, Vol. 67, Issue 2', '2019', 'ISSN: 0474-9030, pp. 557-563', 8]
    ];
    for (let pub of rifPubs) {
      await pool.query(`INSERT INTO faculty_publications (faculty_id, type, title, journal_book_name, year, details, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [rifId, ...pub]);
    }

    // Conferences, Sesions Chaired, and Workshops
    const rifConferences = [
      // Sessions Chaired / Resource Person
      ['Wage and Social Security (Chaired Session)', 'Nehru Academy of Law, Lakkidi, Palakkad, Kerala', 'Dec 2022', 'national', 'Session Chair', 1],
      ['Development of Industrial Laws in India (Chaired Session)', 'Nehru Academy of Law, Lakkidi, Palakkad, Kerala', 'Dec 2022', 'national', 'Session Chair', 2],
      ['Changing Dimensions of Law in the Era of Digital Technology (Chaired Session)', 'Aligarh Muslim University, Malappuram Centre', 'April 2023', 'national', 'Session Chair', 3],
      ['Human Rights and Gender Justice in Indian Perspective (Resource Person)', 'University of Calicut', 'August 2022', 'national', 'Resource Person', 4],
      ['Changing Dimensions of Law in the Era of Digital Technology (Resource Person)', 'Aligarh Muslim University, Malapurram Centre', 'April 2023', 'national', 'Resource Person', 5],
      ['Contours of Debate: Revisiting Basic Structure Doctrine (Resource Person)', 'Markaz Law College, Kozhikode', 'Dec 2023', 'national', 'Resource Person', 6],
      ['Impact of Globalisation on Legal Education- Trends and Challenges: Global and Regional (Resource Person)', 'Nehru Academy of Law, Lakkidi, Kerala', 'Jan 2024', 'international', 'Resource Person', 7],
      ['National Lecture Series in Research Methodology, Emerging Trends and Challenges in legal Research (Resource Person)', 'University of Calicut', 'Jan 2025', 'national', 'Resource Person', 8],
      ['National Lecture Series in Research Methodology, Critical Analysis of Legal Sources and Materials (Resource Person)', 'University of Calicut', 'Jan 2025', 'national', 'Resource Person', 9],
      ['National Lecture Series in Research Methodology, Qualitative and Quantitative Trends and Challenges in Legal Research (Resource Person)', 'University of Calicut', 'Jan 2025', 'national', 'Resource Person', 10],
      ['National Lecture Series in Criminal Law, Culpable Homicide and Murder- A Critical Evaluation (Resource Person)', 'University of Calicut', 'Jan 2026', 'national', 'Resource Person', 11],
      // Papers Presented
      ['Inter-Religious Marriages and its Current Scenario with Special Reference to Jammu and Kashmir', 'Punjab University, Patiala and Institute of Objective Studies New Delhi', 'Sept 2021', 'national', 'Presented Paper', 12],
      ['Exclusion of Muslims from the Citizenship (Amendment)Act, 2019: A Socio-Legal Critique', 'Lovely Professional University, Punjab', 'Sept 2021', 'international', 'Presented Paper', 13],
      ['Differential Gender Reponses to Sexual Harassment and Challenges in Establishing Innocence of the Accused', 'Central University of Kashmir', 'Aug 2021', 'national', 'Presented Paper', 14],
      ['Drug Control Policy in India: A Socio-Legal Analysis', 'Tilak Maharashtra Vidyapeeth, Pune', 'March 2021', 'international', 'Presented Paper', 15],
      ['Drug Abuse in Kashmir During Covid -19 Pandemic: A Socio- Legal Analysis', 'Govt. Degree College, Poonch', 'March 2021', 'national', 'Presented Paper', 16],
      ['Violence Against Women: New Dimensions', 'National Commission for Women & SDM Law College', 'Dec 2019', 'national', 'Presented Paper', 17],
      ['Deviation from the Traditional Principles of Penal Jurisprudence in Socio-Economic Offences-: A Justification', 'University of Kashmir & International Islamic University', '', 'international', 'Presented Paper', 18],
      // Workshops / Short Term Courses
      ['Fugitive Economic Offenders Law: National and International Perspectives', 'Lovely Professional University, Punjab', 'Dec 2018', 'national', 'Participated', 19],
      ['Statistical Analysis Using SPSS', 'Lovely Professional University, Punjab', 'May 2020', 'national', 'Participated', 20],
      ['Outcome Based Education', 'The University of Calicut', 'Oct 2023', 'national', 'Participated', 21],
      ['Intellectual Property Rights- Theory and Practice (3-month course)', 'MG University, Kerala', 'Dec 2022 - Feb 2023', 'national', 'Participated', 22],
      ['One Week Online Workshop on Research Methodology', 'RGNUL Punjab & MNLU Nagpur', 'Jan 2024', 'national', 'Participated', 23]
    ];
    for (let c of rifConferences) {
      await pool.query(`INSERT INTO faculty_conferences (faculty_id, title, details, date, type, role, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [rifId, ...c]);
    }

    // 11. Dr. Viswachandra Nath Madasu
    console.log('Seeding Dr. Viswachandra Nath Madasu...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['viswachandra-nath-madasu']);
    
    const vbio = `He has completed his Post-graduation from Acharya Nagarjuna University. He has done a Ph.D. from Andhra University ”History of Public Health in British India” and qualified SET. He has been teaching Legal History from the last ten years in DSNLU. He taught Europe History and Archival studies in the Department of History and Archaeology, Andhra University before joins in DSNLU. His subjects of interest include Colonial laws and Medical history.`;

    const [vResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Dr. Viswachandra Nath Madasu',
        'viswachandra-nath-madasu',
        'Lecturer',
        'https://dsnlu.ac.in/storage/2022/12/Dr.-Viswachandra.jpg',
        'M.A., M.Phil., Ph.D.',
        '',
        '',
        'Lecturer, Damodaram Sanjivayya National Law University',
        'Colonial laws, Medical history, Legal History, Europe History, Archival studies',
        vbio,
        'regular'
      ]
    );
    const vId = vResult.insertId;

    // Experience
    const vExp = [
      ['Lecturer / Teaching Legal History', 'Damodaram Sanjivayya National Law University (DSNLU)', 'last ten years', 'teaching', 1],
      ['Taught Europe History and Archival studies', 'Department of History and Archaeology, Andhra University', '', 'teaching', 2]
    ];
    for (let exp of vExp) {
      await pool.query(`INSERT INTO faculty_experience (faculty_id, title, institution, period, type, display_order) VALUES (?, ?, ?, ?, ?, ?)`, [vId, ...exp]);
    }

    // 12. Mr. Abhishek Sinha
    console.log('Seeding Mr. Abhishek Sinha...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['abhishek-sinha']);
    
    const abBio = `He has completed his Masters in Economics from University of Lucknow and has been awarded two Gold Medals. His specialization is Econometrics and Mathematics for Economic Analysis. He has passed UGC NET-JRF Exam. He has done LL.B. from University of Lucknow and awarded Gold Medal in Jurisprudence. He is pursuing Ph.D. form University of Lucknow. He has teaching experience of two years. He was teaching Econometrics to the P.G. Dept at Isabella Thoburn Girl’s P.G. College, Lucknow and UPVU Dr. Shakuntala Misra University, Lucknow. He also worked with Vidya Bhawan Girl’s Degree College, Lucknow before joining DSNLU.`;

    const [abResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Mr. Abhishek Sinha',
        'abhishek-sinha',
        'Lecturer',
        'https://dsnlu.ac.in/storage/2022/12/Dr.-Abhiskek.jpg',
        'M.A.',
        '',
        '',
        'Lecturer, Damodaram Sanjivayya National Law University',
        'Econometrics, Mathematics for Economic Analysis, Jurisprudence',
        abBio,
        'regular'
      ]
    );
    const abId = abResult.insertId;

    // Meta (Awards)
    const abMeta = [
      ['Awards', 'Awarded two Gold Medals in Masters in Economics (University of Lucknow) | Gold Medal in Jurisprudence (LL.B., University of Lucknow)', 'other', 1],
      ['Qualifications', 'UGC NET-JRF', 'other', 2]
    ];
    for (let m of abMeta) {
      await pool.query(`INSERT INTO faculty_research_meta (faculty_id, meta_key, meta_value, type, display_order) VALUES (?, ?, ?, ?, ?)`, [abId, ...m]);
    }

    // Experience
    const abExp = [
      ['Lecturer', 'Damodaram Sanjivayya National Law University (DSNLU)', 'Present', 'teaching', 1],
      ['Teaching Econometrics to P.G. Dept', 'Isabella Thoburn Girl’s P.G. College, Lucknow', '', 'teaching', 2],
      ['Teaching Econometrics to P.G. Dept', 'UPVU Dr. Shakuntala Misra University, Lucknow', '', 'teaching', 3],
      ['Faculty', 'Vidya Bhawan Girl’s Degree College, Lucknow', '', 'teaching', 4]
    ];
    for (let exp of abExp) {
      await pool.query(`INSERT INTO faculty_experience (faculty_id, title, institution, period, type, display_order) VALUES (?, ?, ?, ?, ?, ?)`, [abId, ...exp]);
    }

    // 13. Dr. Deepthi R
    console.log('Seeding Dr. Deepthi R...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['deepthi-r']);
    
    const dpBio = `Dr. Deepthi Rodda is Research Associate at DSNLU. Completed her PhD on ‘Software Protection from Piracy under Indian Copyright Law – A Critical Legal Study' in Law in 2021 to Andhra University. She received her LL.M. in Criminal Law from Dr. B. R. Ambedkar College of Law, Andhra University in 2011 and LL.B. (5-YDC) from Padala Rama Reddy law college affiliated to Osmania University in 2009. She cleared UGC-NET two times in 2015 and in 2019. She also cleared TS Eligibility Set in 2018 and AP State Eligibility Set in 2013. Further, she completed her Masters in Political Science from Andhra University and PG Diploma in Cyberlaws from NALSAR in 2018. As a research scholar, Mrs. Deepthi done Swayam, GIAN and FDP courses and has attended various conferences, workshops, training programs held in the premium institutes across the India and also presented papers in academic conferences and seminars. She has also published several research papers. Her areas ofinterest are Jurisprudence, Criminal Laws and Copyright Laws.`;

    const [dpResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Dr. Deepthi R',
        'deepthi-r',
        'Teaching Associate',
        'https://dsnlu.ac.in/storage/2022/12/Dr.-Deepthi.jpg',
        'Ph.D., LL.M., M.A., PGDCL.',
        '',
        '',
        'Research Associate, Damodaram Sanjivayya National Law University',
        'Jurisprudence, Criminal Laws, Copyright Laws',
        dpBio,
        'regular'
      ]
    );
    const dpId = dpResult.insertId;

    // Meta (Qualifications)
    const dpMeta = [
      ['Qualifications', 'UGC-NET (2015, 2019) | TS Eligibility Set (2018) | AP State Eligibility Set (2013)', 'other', 1],
      ['Courses Completed', 'Swayam, GIAN and FDP courses', 'other', 2]
    ];
    for (let m of dpMeta) {
      await pool.query(`INSERT INTO faculty_research_meta (faculty_id, meta_key, meta_value, type, display_order) VALUES (?, ?, ?, ?, ?)`, [dpId, ...m]);
    }

    // Experience
    const dpExp = [
      ['Research Associate', 'Damodaram Sanjivayya National Law University (DSNLU)', 'Present', 'teaching', 1]
    ];
    for (let exp of dpExp) {
      await pool.query(`INSERT INTO faculty_experience (faculty_id, title, institution, period, type, display_order) VALUES (?, ?, ?, ?, ?, ?)`, [dpId, ...exp]);
    }

    // 14. Dr. Neelima Boghadi
    console.log('Seeding Dr. Neelima Boghadi...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['neelima-boghadi']);
    
    // Abstracted bio from achievements
    const nbBio = `Dr. Neelima Boghadi is a Teaching Associate at Damodaram Sanjivayya National Law University (DSNLU). She holds a B.Com., LL.M., and Ph.D. Her research footprint heavily involves Intellectual Property Rights, Geographical Indications, and Commercial Laws. She has published globally notably in the WIPO Magazine and journals of juridical studies. She frequently serves as a panelist, resource person, and guest speaker for prominent IP-related colloquiums, and has also extended her legal awareness campaigns through talks on All India Radio.`;

    const [nbResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Dr. Neelima Boghadi',
        'neelima-boghadi',
        'Teaching Associate',
        'https://dsnlu.ac.in/storage/2022/12/Dr.-Neelima.jpg',
        'B. Com., LL. M., Ph.D.',
        '',
        '',
        'Teaching Associate, Damodaram Sanjivayya National Law University',
        'Intellectual Property Rights, Geographical Indications, Commercial Laws, Arbitration',
        nbBio,
        'regular'
      ]
    );
    const nbId = nbResult.insertId;

    // Meta (Projects & Certifications)
    const nbMeta = [
      ['Research Project', 'Research Assistant - "A Study on Functioning of Commercial Courts in the Southern Region of India for Improving Ease of Doing Business" (Dept. of Justice, Govt. of India) - Jan 2022 to Dec 2022', 'other', 1],
      ['Certifications', 'WIPO Academy Courses: General Course on IP (DL-101), Essentials of Patents (DL-170), IP, TK and TCEs (DL-203)', 'other', 2],
      ['Radio Talks', 'Legal awareness programmes on All India Radio: "Migrated labourers laws & Rights" (2015) & "Giving through social media" (2025)', 'leadership', 3]
    ];
    for (let m of nbMeta) {
      await pool.query(`INSERT INTO faculty_research_meta (faculty_id, meta_key, meta_value, type, display_order) VALUES (?, ?, ?, ?, ?)`, [nbId, ...m]);
    }

    // Publications
    const nbPubs = [
      ['article', 'GI Status to Uppada Jamdani Saree: Did It Really help?', 'Journal of Academy of Juridical Studies, Vol No 11, Issue 1&2', '2020', 'Pages 22-33', 1],
      ['article', 'Protect our Roots- Time to know a Lesser Known IPR, the GI', 'Bonafide voices', '2020', 'Web Publication', 2],
      ['article', 'Crafting a Better Future for Women with Etikoppaka Wooden Toys', 'WIPO Magazine', '2023', 'WIPO Publication', 3],
      ['article', 'How artisans use IP to protect traditional instrument-making in India', 'WIPO Magazine Music Edition', '2025', 'Page 68', 4]
    ];
    for (let pub of nbPubs) {
      await pool.query(`INSERT INTO faculty_publications (faculty_id, type, title, journal_book_name, year, details, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [nbId, ...pub]);
    }

    // Conferences, Talks, Panels
    const nbConferences = [
      // Panels & Guest Speaking
      ['Panel Discussion: “The PMLA Judgment: A tussle between Powers and Rights”', 'Drishtikon Committee at DSNLU', 'Oct 2022', 'national', 'Panelist', 1],
      ['Guest Speaker - World IP Day Theme: "women & IP: accelerating innovation and creativity"', 'APIS, innovation valley, Visakhapatnam', 'April 2023', 'national', 'Guest Speaker', 2],
      ['Ph.D. Course Work Classes - Lecture on Broad Field of research(IPR)', 'DSNLU', 'July 2025', 'national', 'Resource Person', 3],
      // Presentations
      ['Intellectual Property Right Law, Global and National Perspectives', 'National Seminar on Intellectual Property Rights, Andhra University', 'July 2004', 'national', 'Presented Paper', 4],
      ['Geographical Indications as a Gateway for Protection of Local Interest- An Analysis from Indian Perspective', '38th Indian Academy of Social Science Congress, Andhra University', '2015', 'national', 'Presented Paper', 5],
      ['Climatic change its impact over the Indigenous People Rights – A Critical Analysis', 'UGC Seminar on Contemporary Concerns of Environment & Development Dynamics', 'Nov 2022', 'national', 'Presented Paper', 6],
      ['International Mediation – A Significant Alternative for the Resolution of Commercial Disputes', 'GITAM School of Law Virtual Conference', 'Dec 2022', 'international', 'Presented Paper', 7],
      // Participations
      ['Sensitisation Programme on Abatement of Pollution', 'NALSAR & Andhra University', 'Aug 2004', 'national', 'Participated', 8],
      ['Virtual-International Webinar on Challenges to Law and Technology in the 21st Century', 'DSNLU', 'Dec 2020', 'international', 'Participated', 9],
      ['Worldwide Symposium on Geographical Indications', 'WIPO, Tbilisi, Georgia (Hybrid)', 'June 2023', 'international', 'Participated', 10],
      ['National Webinar on “Intellectual Property Rights: The Vision for Development”', 'Sri Padmavati Mahila Visvavidyalayam', 'Aug 2023', 'national', 'Participated', 11],
      ['National workshop on geographical indications and gi certificate handover ceremony of Atreyapuram Pootharekulu', 'DSNLU DPIIT Chair', 'Sept 2023', 'national', 'Participated', 12],
      ['NEP 2020 Orientation & Sensitization Programme', 'Malaviya Mission, Sri Venkateswara University', 'Nov 2023', 'national', 'Participated', 13]
    ];
    for (let c of nbConferences) {
      await pool.query(`INSERT INTO faculty_conferences (faculty_id, title, details, date, type, role, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [nbId, ...c]);
    }

    // 15. Ms. Sherley Hepsiba Dokiburra
    console.log('Seeding Ms. Sherley Hepsiba Dokiburra...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['sherley-hepsiba-dokiburra']);

    const shResult = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Ms. Sherley Hepsiba Dokiburra',
        'sherley-hepsiba-dokiburra',
        'Teaching Associate',
        'https://dsnlu.ac.in/storage/2024/10/Dr.-Sherley-Hepsiba-Dokiburra-1.png',
        '',
        '',
        '',
        'Teaching Associate, Damodaram Sanjivayya National Law University',
        '',
        '',
        'regular'
      ]
    );

    // 16. Dr. Arvind Nath Tripathi
    console.log('Seeding Dr. Arvind Nath Tripathi...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['arvind-nath-tripathi']);
    
    const arBio = `He completed his LL.M. in 2011 from Dr. Ram Manohar Lohiya National Law University, Lucknow. He has done his B.A., LL.B. (Honours) from University of Kalyani (Kolkata). He has more than five international publications to his credit. He has participated and presented papers in various National and international Conferences, seminars/workshops and symposiums. He has worked as Law Clerk (Trainee) at Allahabad High Court (Lucknow Bench). He is pursuing Ph.D. in law on “Witness Protection: The anomaly of Indian Criminal Justice System and its solution.” His areas of interests are Legal Methods, Administrative Law, Family Law and Constitutional law.`;

    const [arResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Dr. Arvind Nath Tripathi',
        'arvind-nath-tripathi',
        'Research Assistant',
        'https://dsnlu.ac.in/storage/2022/12/arvind-tripathi-1.png',
        'LL.M., B.A., LL.B. (Honours)',
        '',
        '',
        'Research Assistant, Damodaram Sanjivayya National Law University',
        'Legal Methods, Administrative Law, Family Law, Constitutional law',
        arBio,
        'regular'
      ]
    );
    const arId = arResult.insertId;

    // Experience
    const arExp = [
      ['Research Assistant', 'Damodaram Sanjivayya National Law University', 'Present', 'teaching', 1],
      ['Law Clerk (Trainee)', 'Allahabad High Court (Lucknow Bench)', '', 'other', 2]
    ];
    for (let exp of arExp) {
      await pool.query(`INSERT INTO faculty_experience (faculty_id, title, institution, period, type, display_order) VALUES (?, ?, ?, ?, ?, ?)`, [arId, ...exp]);
    }

    // 17. Ms. D. Aparna
    console.log('Seeding Ms. D. Aparna...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['d-aparna']);

    const apBio = `Ms Aparna Dumpala is a faculty member at Damodaram Sanjivayya National Law University. She completed her B.A. LL.B. from Andhra University and her LL.M. in Constitutional Law from Damodaram Sanjivayya National Law University. She is presently pursuing her Ph.D. in Environmental Law from DSNLU.

Her academic interests include Constitutional Law, Environmental and Climate Change Law. At DSNLU, she teaches courses such as Health Laws, Constitutional Law, Legal and Professional Ethics, Affirmative Action, and Comparative Constitution. She actively participates in conferences, faculty development programmes, capacity building initiatives, and certification courses. She aims to contribute to legal education through effective teaching and meaningful research.`;

    const [apResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Ms. D. Aparna',
        'd-aparna',
        'Research Assistant',
        'https://dsnlu.ac.in/storage/2024/10/Ms.-D.-Aparna-2.png',
        'B.A. LL.B., LL.M.',
        '',
        '',
        'Research Assistant, Damodaram Sanjivayya National Law University',
        'Constitutional Law, Environmental Law, Climate Change Law',
        apBio,
        'regular'
      ]
    );
    const apId = apResult.insertId;

    // Experience
    const apExp = [
      ['Research Assistant', 'Damodaram Sanjivayya National Law University', 'Present', 'teaching', 1]
    ];
    for (let exp of apExp) {
      await pool.query(`INSERT INTO faculty_experience (faculty_id, title, institution, period, type, display_order) VALUES (?, ?, ?, ?, ?, ?)`, [apId, ...exp]);
    }

    // Publications
    const apPubs = [
      ['article', 'Exploring the Role of Indian Youth in Addressing Climate Change: Legal Frameworks, Challenges, and Opportunities', 'Hidayatullah National Law University Journal of Law & Social Sciences, Vol. X, Issue I', '2024', 'ISSN: 2347-839X', 1],
      ['article', 'Assessing the Economic Impacts of Climate Change on the North Eastern States of India: Challenges, Vulnerabilities and Adaptation Strategies', 'Lex Terra, National Law University and Judicial Academy, Assam, Issue 44', 'June 2024', 'ISSN 2455-0965', 2],
      ['article', 'Evolution and Dynamics of Soft Law in International Relations', 'Integral Law Review, Volume III', '2024-25', 'ISSN: 3048-5258', 3],
      ['article', 'Constitutional Validity of Digital Personal Data Protection Bill 2022', 'DSNLU Journal of Science, Technology and Law, VOLUME 3, ISSUE 1', '2023', 'E-ISSN-2583-1208', 4],
      ['article', 'Critical Analysis on Mental Health law in India', 'International Journal of All Research Education and Scientific Methods (IJARESM), Volume 11, Issue 5', 'May 2023', 'ISSN: 2455-621', 5]
    ];
    for (let pub of apPubs) {
      await pool.query(`INSERT INTO faculty_publications (faculty_id, type, title, journal_book_name, year, details, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [apId, ...pub]);
    }

    // Conferences
    const apConf = [
      ['Climate Change and Ocean Acidification, Ocean Fertilization, and Marine Cloud Brightening: Legal Responses', 'Two-Day National Conference on Climate Change & Sustainable Development, Bharath Institute of Law', 'Oct-Nov 2025', 'national', 'Presented Paper', 1],
      ['Workshop on AI TOOLS IN LEGAL & INTERDISCIPLINARY ACADEMIC RESEARCH', 'National Law University Delhi', 'June 2025', 'national', 'Participated', 2],
      ['One Week Online Capacity Development Programme on Legal Education, Research and Publication', 'RMLNLU, NLUJ, et al.', 'June 2025', 'national', 'Participated', 3],
      ['Faculty Development Programme on "CONTEMPORARY APPROACHES TO LEGAL RESEARCH"', 'Hindustan Institute of Technology and Science', 'Feb 2024', 'national', 'Participated', 4],
      ['Faculty Updation Program (FUP) on "Techno-Legal Dimensions of Cyber Laws, Cyber Security and Data Privacy"', 'Andhra University', 'March 2025', 'national', 'Participated', 5]
    ];
    for (let c of apConf) {
      await pool.query(`INSERT INTO faculty_conferences (faculty_id, title, details, date, type, role, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [apId, ...c]);
    }

    // 18. Ms. Gali Parivarthana
    console.log('Seeding Ms. Gali Parivarthana...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['gali-parivarthana']);

    const gpBio = `Ms Gali Parivarthana is a Research Assistant (Law) at Damodaram Sanjivayya National Law University (DSNLU), Visakhapatnam, and a doctoral researcher pursuing a PhD in Law at DSNLU. Her doctoral research focuses on Environmental Law and Technology Regulation, with particular emphasis on sustainable artificial intelligence infrastructure and climate governance in India.

She holds an LL.M. in International Corporate and Commercial Law from the University of York, United Kingdom, where her dissertation examined ethical and legal considerations surrounding workforce reduction in the age of artificial intelligence. She completed her BBA LL.B. (Hons.) from ICFAI Law School, Hyderabad, with a specialization in Intellectual Property Rights and Business Laws.

Ms Parivarthana has teaching experience in Banking Laws, International Contracts, International Trade Law, Insolvency Laws, Maritime Law, Commercial Arbitration, and Special Contracts, and teaches both undergraduate and postgraduate law students. Her academic responsibilities include course planning, student mentoring, evaluation, and academic coordination.

Her academic interests span Technology Law, Environmental Law, Corporate and Commercial Law, and Intellectual Property Law. She actively contributes to institutional governance through various academic centres and committees at DSNLU.`;

    const [gpResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Ms. Gali Parivarthana',
        'gali-parivarthana',
        'Research Assistant',
        'https://dsnlu.ac.in/storage/2024/10/Ms.-Gali-Parivarthana-1.png',
        'BBA LL.B. (Hons.), LL.M.',
        '',
        '',
        'Research Assistant (Law), Damodaram Sanjivayya National Law University',
        'Technology Law, Environmental Law, Corporate and Commercial Law, Intellectual Property Law',
        gpBio,
        'regular'
      ]
    );
    const gpId = gpResult.insertId;

    // Experience
    const gpExp = [
      ['Research Assistant (Law)', 'Damodaram Sanjivayya National Law University', 'Present', 'teaching', 1]
    ];
    for (let exp of gpExp) {
      await pool.query(`INSERT INTO faculty_experience (faculty_id, title, institution, period, type, display_order) VALUES (?, ?, ?, ?, ?, ?)`, [gpId, ...exp]);
    }

    // Publications
    const gpPubs = [
      ['article', 'Artificial Intelligence, Environmental Sustainability and Law: Regulating the Carbon Footprint of Data Centers in India (Forthcoming)', 'International Conference on Artificial Intelligence & Digital Technologies (ISAIDT) & HPNLU', '2025', 'Forthcoming Publication', 1],
      ['article', 'Corporate Shirking: A Humane Approach', 'International Journal of Research in Academic World', '2022', 'E-ISSN: 2583-1615', 2],
      ['article', 'Decentralization of Judicial Institutions in India – Need for Regional Supreme Court Benches (Co-Author)', 'North South Imbalances in Global Arena, Andhra Law Times, Hyderabad', '2020', 'ISBN: 978-81-942-1782-90', 3]
    ];
    for (let pub of gpPubs) {
      await pool.query(`INSERT INTO faculty_publications (faculty_id, type, title, journal_book_name, year, details, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [gpId, ...pub]);
    }

    // Conferences
    const gpConf = [
      ['Artificial Intelligence, Environmental Sustainability and Law: Regulating the Carbon Footprint of Data Centers in India', 'International Conference on Artificial Intelligence & Digital Technologies, ISAIDT & HPNLU, Shimla', 'Nov 2025', 'international', 'Presented Paper', 1],
      ['Faculty Updation Programme on Techno-Legal Dimensions of Cyber Laws, Cyber Security and Data Privacy', 'Andhra University (ISEA–MeitY)', 'March 2025', 'national', 'Participated', 2],
      ['Seminar on Bhartiya Nyaya Samhita, 2023', 'Hyderabad', 'March 2024', 'national', 'Participated', 3],
      ['Intercultural Communication Workshop', 'Centre for Global Programmes, University of York, UK', 'June 2023', 'international', 'Participated', 4],
      ['North-South Imbalances in Global Arena (Perspectives and Challenges)', 'International Conference, Ram Reddy Centre for Distance Education, Osmania University', '2020', 'international', 'Presented Paper', 5],
      ['The Interplay of Economics, Politics & Society', 'International Conference, Thimphu, Bhutan', 'July 2017', 'international', 'Participated', 6]
    ];
    for (let c of gpConf) {
      await pool.query(`INSERT INTO faculty_conferences (faculty_id, title, details, date, type, role, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [gpId, ...c]);
    }

    // 19. Dr. S. Kiran Kumari
    console.log('Seeding Dr. S. Kiran Kumari...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['s-kiran-kumari']);

    const skResult = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Dr. S. Kiran Kumari',
        's-kiran-kumari',
        'Research Assistant',
        'https://dsnlu.ac.in/storage/2024/11/Dr.-S.-Kiran-Kumari.png',
        '',
        '',
        '',
        'Research Assistant, Damodaram Sanjivayya National Law University',
        '',
        '',
        'regular'
      ]
    );

    // 20. Dr. K. Sudha
    console.log('Seeding Dr. K. Sudha...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['k-sudha']);

    const suBio = `Dr K. Sudha is an alumnus of Acharya Nagarjuna University, Andhra Pradesh. She has 23 years teaching experience at DSNLU and Montessori Mahila College of Law, Vijayawada, AP and practiced law at Vijayawada between 2003 and 2009. She teaches environmental law, international environmental law and administrative law and her areas of research are environmental law, social justice, sex trafficking and land laws.

Her book titled ‘Prostitution Laws: An Enigma and Some Dilemmas’ was published by Promilla & Co. Publishers in association with Bibliophile South Asia, New Delhi in 2016. She edited/ co-edited three books titled ‘Managing the Blue’ (2022), ‘Conserve for Future” (2021), and ‘Green Governance’ (2018) which were published by DSNLU as a part of its Environmental Law Series. She was also the associate editor of another DSNLU publication titled “Law and Mental Health (Clinic to Community Care)” (2021). She writes both in Telugu and English.

She is/was associated with three research projects and is the Project Director of an ICSSR sponsored Minor Research Project titled ‘the study of digitization and modernization of land records in India with special reference to Visakhapatnam district in the State of Andhra Pradesh’ in 2022-23.

She organized two ICSSR-SRC sponsored events namely: a 2 day National Webinar on “Water Management Laws: Laws, Livelihood and Environment” (2021) and secondly, a 2 day National Seminar on “Land, Records and Rights: Laws, Governance and Challenges” (2023) and an Andhra Pradesh State Council of Higher Education (APSCHE) sponsored 2 day National Seminar on “Law and Gender Justice” (2011).

Apart from her academic interests, she finds herself in the human rights movement and her association with it goes back to 1983. She is one of the 33 founding members of Human Rights Forum (HRF), an AP and Telangana based human rights organization formed in 1998 that seeks to address structured oppression and inequality.`;

    const [suResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Dr. K. Sudha',
        'k-sudha',
        'Assistant Professor',
        'https://dsnlu.ac.in/storage/2022/12/Dr.-K.Sudha_.jpg',
        'Ph.D., M.L., B.L., B.A.',
        '',
        'sudhakavuri@dsnlu.ac.in',
        'Assistant Professor, Damodaram Sanjivayya National Law University',
        'Environmental Law, International Environmental Law, Administrative Law, Social Justice, Land Laws',
        suBio,
        'regular'
      ]
    );
    const suId = suResult.insertId;

    // Experience
    const suExp = [
      ['Assistant Professor', 'Damodaram Sanjivayya National Law University (DSNLU)', 'Present', 'teaching', 1],
      ['Teaching', 'Montessori Mahila College of Law, Vijayawada', '', 'teaching', 2],
      ['Advocate', 'Practiced law at Vijayawada', '2003 - 2009', 'other', 3]
    ];
    for (let exp of suExp) {
      await pool.query(`INSERT INTO faculty_experience (faculty_id, title, institution, period, type, display_order) VALUES (?, ?, ?, ?, ?, ?)`, [suId, ...exp]);
    }

    // Major Publications (Books, English/Telugu Articles, Translations)
    const suPubs = [
      // Books
      ['book', 'Prostitution Laws: An Enigma and Some Dilemmas', 'Promilla & Co. Publishers / Bibliophile South Asia, New Delhi', '2016', 'ISBN No. 978-93-823373-4-8', 1],
      ['book', 'Managing the Blue – Environmental Law Series – III (Edited)', 'DSNLU / ICSSR-SRC', '2022', 'ISBN No. 978-81-954254-0-2', 2],
      ['book', 'Conserve for Future- Environmental Law Series II (Edited)', 'DSNLU', 'Dec 2021', 'ISBN No. 978-81-954254-8-8', 3],
      ['book', 'Law and Mental Health (Clinic to Community Care) (Associate Editor)', 'DSNLU', 'Sept 2021', 'ISBN No. 978-81-954254-1-9', 4],
      ['book', 'Green Governance – Environmental Law Series I (Edited)', 'Asia Law House and DSNLU', '2018', 'ISBN No. 978-81-933989-4-4', 5],
      // English Articles
      ['article', 'Climate Change Litigation: Chronicles from the Global South – A Comparative Study', 'Comparative Law Review, Nicolaus Copernicus University, Poland (Scopus Indexed)', 'Dec 2022', '28 (2022)', 6],
      ['article', 'Armed Conflict: Impact on Children’s Mental Health', 'Law and Mental Health (Clinic to Community Care)', '2021', 'Book Chapter', 7],
      ['article', 'Recreation of Disparities', 'Economic and Political Weekly (Scopus Indexed)', 'July 2020', 'Vol LV Nos 28 & 29', 8],
      ['article', 'Navigating through Data Collection in Empirical Research', 'Readings in Legal and Social Research (Regal Publications)', '2019', 'Book Chapter', 9],
      ['article', 'Trained and Gender Sensitive Counselors: Need of the Hour', 'Incompatible Spouses – Counseling Initiatives', '2018', 'Book Chapter', 10],
      ['article', 'The Protection of Women from Domestic Violence Act: Evolving Law', 'Kaav International Journal of Arts, Humanities & Social Science', 'Feb 2018', 'Volume -5 Special Issue – 1', 11],
      ['article', 'Social Democracy – Need of the Hour', 'International Journal of Academic Research', 'March 2017', 'Volume 4, Issue 3(5)', 12],
      ['article', 'Encounter killings: Who is the judge?', 'Human Rights Report India', 'March 2015', 'Vol. I, Issue II', 13],
      ['article', 'Challenges to Clinical Legal Education in contemporary India: a few reflections', 'International Journal of Multidisciplinary Educational Research', 'Jan 2013', 'Vol. 2, Issue 1', 14],
      ['article', 'Evolution of Women’s Right to Education in India', 'Journal of Academy of Juridical Studies', 'June 2012', 'Vol. 7, No.1', 15],
      ['article', 'Five Years of Protection of Women from Domestic Violence act, 2005', 'The Legal Analyst', '2012', 'Vol. II No.1', 16],
      ['article', 'Forest Regulation and Forest Dwellers Rights', 'Chotanagpur Law Journal', '2011-12', 'Vol 4, No. 4', 17],
      ['article', 'Contemporary debate on Prostitution: Some legal Dilemmas', 'ANU Journal of Law', '2011', 'Vol. III No. 1 & 2', 18],
      ['article', 'Impact of Delinking Irretrievable Breakdown Ground of Divorce and Marital Property: A few reflections', 'The Legal Analyst', '2011', 'Vol. I No. 2', 19],
      // Telugu Publications and Translations
      ['article', 'Henceforth Jayasree is a slogan (Obituary)', 'Human Rights Bulletin 17-2022', '2022', 'Telugu Publication', 20],
      ['article', 'Condolence to Human Rights Defender Jayasree', 'Human Rights Forum (Booklet)', 'Aug 2021', 'Telugu Publication', 21],
      ['article', 'Constitutionality of Supreme Court Orders', 'Human Rights Bulletin – 2019', 'Nov 2020', 'Telugu Publication', 22],
      ['article', 'Roll Back of Environmental Law', 'Human Rights Bulletin – 2017', 'Oct 2017', 'Telugu Publication', 23],
      ['article', 'A great perfectionist', 'Gnaapakaalam', 'Jan 2016', 'Telugu Publication', 24],
      ['article', 'In the presence of Kudala Sangama Deva', 'Andhra Jyothi', 'Nov 2015', 'Telugu Daily', 25],
      ['article', 'Police continue to be judges in encounter killings', 'Human Rights Bulletin 14', '2015', 'Telugu Publication', 26],
      ['book', 'Our Laws (Compendium Translation)', 'Dalita Stree Sakthi, Hyderabad', '2011', 'Telugu Translation', 27],
      ['article', 'Does Irretrievable Breakdown of Marriage Ground for Divorce suit our country?', 'Human Rights Bulletin 12', '2011', 'Telugu Publication', 28],
      ['article', 'These lives do offend the gentlefolk', 'Andhra Jyothi', 'April 2010', 'Telugu Daily', 29],
      ['article', 'Acid Attacks in the name of love: A Reflection', 'Human Rights Bulletin 9', '2008', 'Telugu Publication', 30],
      ['article', 'Protection of Women Against Domestic Violence', 'Andhra Jyothi', 'Oct 2006', 'Telugu Daily', 31],
      ['article', 'The Property less Adivasi Women', 'Human Rights Bulletin 7', '2005', 'Telugu Publication', 32],
      ['article', 'Let’s talk about the Disabilities Issue in the Rights perspective', 'Human Rights Bulletin 5', '2002', 'Telugu Publication', 33],
      ['article', 'Business School: High Court’s Decision', 'Human Rights Bulletin 2', '2000', 'Telugu Publication', 34],
      ['article', 'Women and Law', 'Vijayawada Slum Improvement Project', '1996', 'Telugu Publication', 35],
      ['book', 'To Kill or not to Kill (Telugu Translation of Gauri Lankesh Reader excerpt)', 'Hyderabad Book Trust', 'Dec 2017', 'Translation', 36]
    ];
    for (let pub of suPubs) {
      await pool.query(`INSERT INTO faculty_publications (faculty_id, type, title, journal_book_name, year, details, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [suId, ...pub]);
    }

    // Conferences, Extension Work, Organizations
    const suConf = [
      // International
      ['The Expendables of the Sea: Marginalization of the Traditional Fishing Community in India', 'University of Zurich / URPP', 'Oct 2022', 'international', 'Presented Paper', 1],
      ['Climate Change Litigation: Chronicles of the Global South', '19th ASLI Conference / University of Tokyo', 'May 2022', 'international', 'Presented Paper', 2],
      ['The Protection of Women from Domestic Violence Act: Evolving Law', 'Ch. S. D. St Theresa College for Women, Eluru', 'Feb 2018', 'international', 'Presented Paper', 3],
      ['Case Comment on Puttuswami and Another v Union of India', 'VIT School of Law, Chennai', 'Jan 2018', 'international', 'Presented Paper', 4],
      ['The Mind, Environment and the World Beyond', 'School of Law, GITAM University', 'Nov 2016', 'international', 'Presented Paper', 5],
      // National
      ['Global Compact on Refugees Fostering Law, Policies and Practices vis-a vis Protection and Care', 'VIT AP University / TISS / UNHCR', 'June 2021', 'national', 'Participated', 6],
      ['Persons with Disabilities: Legal Perspectives and Evolving Law', 'Andhra University', 'March 2018', 'national', 'Presented Paper', 7],
      ['Administration of Justice in the Supreme Court of India: Rights Perspective', 'Sri Padmavathi Mahila Vishwavidyalayam, Tirupathi', 'March 2018', 'national', 'Presented Paper', 8],
      ['Sompeta Struggle: a Success Story', 'SKSD Mahila Kalasala UG & PG (A), Tanuku', 'March 2018', 'national', 'Presented Paper', 9],
      ['Twelve years journey of "the Protection of Women from Domestic Violence Act, 2005"', 'Acharya Nagarjuna University', 'Jan 2018', 'national', 'Presented Paper', 10],
      ['Social Democracy – Need of the Hour', 'SKSD Mahila Kalasala UG&PG(A), Tanuku', 'March 2017', 'national', 'Presented Paper', 11],
      ['Environmental Law –Contemporary Issues, Challenges and Future Perspectives', 'DSNLU', 'Oct 2012', 'national', 'Participated', 12],
      ['Law and Gender Justice', 'AP University of Law, Visakhapatnam', 'Sept 2011', 'national', 'Presented Paper', 13],
      ['Two-day National Conference of All India Law Teachers Congress (AILTC)', 'New Delhi', 'June 2011', 'national', 'Presented Paper', 14],
      ['Women Rights in India: Issues and Challenges (WRICC-2012)', 'UGC Seminar', '2012', 'national', 'Presented Paper', 15],
      ['Human Rights Training Programme', 'Andhra University & NHRC', 'Dec 2010', 'national', 'Participated', 16],
      ['Right to Education in India: A Historical Perspective', 'AP University of Law', 'Feb 2010', 'national', 'Presented Paper', 17],
      ['Right to Information and Judiciary', 'AP University of Law', 'Feb 2010', 'national', 'Presented Paper', 18],
      ['New Economic Policy and Labour Laws', 'Nagarjuna University', 'March 2001', 'national', 'Presented Paper', 19],
      // Organized Seminars
      ['Land, Records and Rights: Laws, Governance and Challenges (Convener)', 'DSNLU / ICSSR-SRC', 'Sept 2023', 'national', 'Organized', 20],
      ['Water Management Laws: Life, Livelihood and Environment (Convener)', 'DSNLU / ICSSR-SRC', 'Sept 2021', 'national', 'Organized', 21],
      ['Law and Mental Health (Co-Convener)', 'DSNLU', 'March 2019', 'national', 'Organized', 22],
      ['The Biodiversity Act (Faculty Coordinator)', 'DSNLU / NLSIU / UNDP / GEF', 'Jan 2019', 'national', 'Organized', 23],
      ['Environmental Law Teaching and Practice for Sustainable Development (Local Coordinator)', 'DSNLU / NLSIU / M.K. Nambyar Academy', 'Oct 2016', 'national', 'Organized', 24],
      ['Law and Gender Justice (Director)', 'AP University of Law, Visakhapatnam', 'Sept 2011', 'national', 'Organized', 25],
      // Resource Person / Extension
      ['Resource Person - Waste Management Law and Practice', 'Dr. B.R. Ambedkar College of Law', 'Nov 2022', 'national', 'Resource Person', 26],
      ['Resource Person - Women’s Rights: National Perspectives', 'Manikchand Pahade Law College, Aurangabad', 'March 2022', 'national', 'Resource Person', 27],
      ['Guest Lecture - Sexual Harassment Act', 'Indian Maritime University, Visakhapatnam', 'Dec 2021', 'national', 'Resource Person', 28],
      ['Resource Person - Qualitative Research', 'Seshadripuram Law College, Bangalore', 'Oct 2021', 'national', 'Resource Person', 29],
      ['Resource Person - Forest Laws in India', 'Manikchand Pahade Law College, Aurangabad', 'Feb 2021', 'national', 'Resource Person', 30],
      ['Co-Chair - National Model Conference of Parties', 'DSNLU', 'Oct 2017', 'national', 'Resource Person', 31],
      ['Resource person - Discussing evolving Law with Evolving Students', 'NLSIU, Bangalore', 'Dec 2016', 'international', 'Resource Person', 32],
      ['Panelist - Death Penalty for Rape', 'NALSAR', 'Dec 1999', 'national', 'Panelist', 33],
      // Extension Highlights 
      ['Founding Member & Activities', 'Human Rights Forum (HRF)', '1983 - Present', 'national', 'Panelist', 34],
      ['UN Human Rights Council’s 4th Periodic Review Report for AP', 'UNHRC', 'Jan 2022', 'international', 'Panelist', 35],
      ['Resource Person - Domestic Violence Act', 'Dalit Stree Sakthi (DSS)', 'June 2021', 'national', 'Resource Person', 36],
      ['Speaker - Repeal of the Unlawful Activities (Prevention) Act, 1967', 'Human Rights Forum (HRF), Guntur', 'March 2021', 'national', 'Panelist', 37],
      ['Chaired 5th annual Kantamneni Ravindra Rao Memorial Lecture', 'PB Siddhartha Academy', 'Jan 2020', 'national', 'Resource Person', 38],
      ['Speaker/Lectures on POCSO, JJ Act, Constitutional rights of children', 'Dept of Women and Child Development, Govt of AP', 'March 2018', 'national', 'Resource Person', 39],
      ['Resource Person - Judicial Officers Workshop', 'Visakhapatnam & Srikakulam', '2012, 2017', 'national', 'Resource Person', 40],
      ['All India Radio Talks on Human Rights', 'AIR', 'Multiple', 'national', 'Resource Person', 41]
    ];
    for (let c of suConf) {
      await pool.query(`INSERT INTO faculty_conferences (faculty_id, title, details, date, type, role, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [suId, ...c]);
    }

    // 21. Dr. V. Sunitha
    console.log('Seeding Dr. V. Sunitha...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['v-sunitha']);

    const vsBio = `Dr.V.Sunitha studied LL.B from Ambedkar Law College, Sri Venkateswara University, Tirupati. She completed her L.L.M from P.G.Department of Law, Sri Venkateswara University, Tirupati and awarded Govindarajulu Memorial Gold medal for securing University First Rank. She obtained Ph.D in Law from Sri Padmavathi Mahila Visvavidyalayam, Tirupati for her Thesis “Legal Approach Towards Marine Pollution in Environmental Regime- A Case Study”.

She cleared UGC-NET and JRF in Law in 2009. She holds a P.G Diploma in Human Rights and Social Development from Sri Venkateswara University, Tirupati. Her journey towards teaching started at Anantha Law College, Tirupati as Asst. Professor in Law.

She attended/participated in various National and International Conferences/Seminars, workshops, published papers in reputed journals and participated in Refreshing course. Her areas of interest are Law of Torts, Environment Law and Constitutional Law.`;

    const [vsResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Dr. V. Sunitha',
        'v-sunitha',
        'Assistant Professor',
        'https://dsnlu.ac.in/storage/2022/12/Dr.-V.Sunitha.jpg',
        'L.L.M., Ph.D., P.G. in HR & SD.',
        '',
        '',
        'Assistant Professor, Damodaram Sanjivayya National Law University',
        'Law of Torts, Environment Law, Constitutional Law',
        vsBio,
        'regular'
      ]
    );
    const vsId = vsResult.insertId;

    // Experience
    const vsExp = [
      ['Assistant Professor', 'Damodaram Sanjivayya National Law University', 'Present', 'teaching', 1],
      ['Asst. Professor in Law', 'Anantha Law College, Tirupati', '', 'teaching', 2]
    ];
    for (let exp of vsExp) {
      await pool.query(`INSERT INTO faculty_experience (faculty_id, title, institution, period, type, display_order) VALUES (?, ?, ?, ?, ?, ?)`, [vsId, ...exp]);
    }

    // 22. Dr. Paramata Bhuvaneswari
    console.log('Seeding Dr. Paramata Bhuvaneswari...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['paramata-bhuvaneswari']);

    const pbBio = `She has completed her LL. B from S.S.V.P Law College (Andhra University) and LLM with Corporate and Securities Law in Acharya Nagarajuna University. Her interested area is Corporate and Securities Law and she has completed Ph.D. in Law from Acharya Nagarajuna University on the Research Topic Corporate Governance Law and legal perspectives. She had total 10 years teaching experience. She also completed M.Phil. in (Edu) in Acharya Nagarajuna University on the topic the quality in higher education and she also completed MA (Lit) in Dr. B. R. Ambedkar University. She published 5 publications on Corporate Law in National and International Journals, and she presented papers in various seminars and workshops of National and International seminars.`;

    const [pbResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Dr. Paramata Bhuvaneswari',
        'paramata-bhuvaneswari',
        'Teaching Associate',
        'https://dsnlu.ac.in/storage/2022/12/Dr.-P.Bhuvaneswari.jpg',
        'MA (Lit)., LLM., M.Phil.(Edu)., Ph.D.(Law).',
        '',
        '',
        'Teaching Associate, Damodaram Sanjivayya National Law University',
        'Corporate and Securities Law, Corporate Governance Law',
        pbBio,
        'regular'
      ]
    );
    const pbId = pbResult.insertId;

    // Experience
    const pbExp = [
      ['Teaching Associate', 'Damodaram Sanjivayya National Law University', 'Present', 'teaching', 1],
      ['Teaching', 'Total 10 years teaching experience', '', 'teaching', 2]
    ];
    for (let exp of pbExp) {
      await pool.query(`INSERT INTO faculty_experience (faculty_id, title, institution, period, type, display_order) VALUES (?, ?, ?, ?, ?, ?)`, [pbId, ...exp]);
    }

    // 23. Dr. Durga Prasad Inturu
    console.log('Seeding Dr. Durga Prasad Inturu...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['durga-prasad-inturu']);
    
    const dpiBio = `Dr. Durga Prasad studied L.L.B. from Siddhartha Law College, Vijayawada. He completed L.L.M (Torts & Crimes) from P.G. department of Legal Studies and Research, Acharya Nagarjuna University and secured Gold Medal. He has completed his Ph.D., on “Criminal Justice System in India Delay in Disposal of Cases – A Comprehensive Study” from Acharya Nagarjuna University. He also cleared U.G.C. NET with J.R.F in Law 2010 and cleared TNSET in political science in 2018. His teaching career started as a faculty of Law from Acharya Nagarjuna University. Further he completed his masters in Political Science and Psychology from Acharya Nagarjuna University.    He attended and participated in various National and International conferences, seminars, workshops, refreshing courses and published his papers in reputed journals. His areas of interests are Torts, Crimes and Women and Law.`;

    const [dpiResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Dr. Durga Prasad Inturu',
        'durga-prasad-inturu',
        'Teaching Associate',
        'https://dsnlu.ac.in/storage/2022/12/Dr.-Durga-Prasad.jpg',
        'M.A., M.Sc., L.L.M., B.Li.Sc., Ph.D., LAW.',
        '',
        '',
        'Teaching Associate, Damodaram Sanjivayya National Law University',
        'Torts, Crimes, Women and Law',
        dpiBio,
        'regular'
      ]
    );
    const dpiId = dpiResult.insertId;

    const dpiExp = [
      ['Teaching Associate', 'Damodaram Sanjivayya National Law University', 'Present', 'teaching', 1],
      ['Faculty of Law', 'Acharya Nagarjuna University', '', 'teaching', 2]
    ];
    for (let exp of dpiExp) {
      await pool.query(`INSERT INTO faculty_experience (faculty_id, title, institution, period, type, display_order) VALUES (?, ?, ?, ?, ?, ?)`, [dpiId, ...exp]);
    }

    // 24. Prof. (Dr.) Bhavani Prasad Panda
    console.log('Seeding Prof. (Dr.) Bhavani Prasad Panda...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['bhavani-prasad-panda']);

    const bpBio = `(Founding Vice Chancellor, Maharashtra National Law University, Mumbai)
Formerly Professor of Eminence (Law), Registrar, DSNLU, Visakhapatnam
Formerly Director, KIIT School of Law, Bhubabneswar,
Formerly Chair Professor Human Rights Law, KIIT School of Law, Bhubaneswar

<strong>Research Work/ Supervision:</strong>
Completed Research work PhD (Awarded): 45 (Forty-five)
Completed Research work LL.D (Awarded): 03 Three

<strong>Resource Person/ Expert</strong>
Resource person at various seminars, symposiums, FDPs, workshops and panellists in various academic discourses at both national and international levels
Addressed at more than 150 seminars, conferences, workshops and contributed papers
Evaluated more than 60 PhD/LL.D thesis in the faculty of law

<strong>Administrative Responsibilities:</strong>
Complete and holistic academic administration at Mumbai
Chairman, Maharashtra State Legal Education CET
Academic Advisor, DSNLU, Visakhapatnam
Undertaken responsibilities at higher academic and administrative functions of Universities, Senate, Academic Council, Executive Council, General Council etcetera for more than 30 years

<strong>Academic Administration Positions (in recent past):</strong>
Member, Executive Council, DSNLU, Visakhapatnam, AP
Member, Executive Council, MNLU, Aurangabad, Maharashtra
Member, Academic Council, NLU, Jodhpur
Member, Academic Council, NALSAR, Hyderabad

<strong>Life member in a number of legal and criminological institutes in India and abroad:</strong>
Indian Law Institute, New Delhi
Indian Society of Criminology, Chennai
Indian Society of Victimology, Chennai
Central India Law Institute, Jabalpur
Indian Academy of Social Sciences, Allahabad
Indian Society of Life Cycle Assessment, Mumbai
National Ecology and Environment Foundation, Mumbai

<strong>Awards:</strong>
NR Madhava Menon, BEST LAW TEACHER AWARD 2016(Very Coveted award of Law Teachers in India)
Conferred the Fellow of Indian Society of Criminology, FICS ’99 – by the Indian Society of Criminology, Chennai.

<strong>References:</strong>
Mr Justice Satish Sharma, Chief Justice, Delhi High Court, New Delhi
Mr Justice, A S Oka, Judge, Supreme Court of India, New Delhi
Justice Fakir Mohammad Ibrahim Kalifulla, Former Judge Supreme Court of India, [Founding Chancellor, Maharashtra National Law University, Mumbai]`;

    const [bpResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Prof. (Dr.) Bhavani Prasad Panda',
        'bhavani-prasad-panda',
        'Adjunct Professor, OSD (Academics, Accounts & Administration)',
        'https://dsnlu.ac.in/storage/2026/02/Prof.-Dr.-Bhavani-Prasad-Panda-2.jpg',
        'LL.D, Ph.D (Law), M.L, M.A, B.Sc',
        '+91 7045353877, +91 9437358241',
        'bppanda2017@gmail.com',
        'Adjunct Professor, DSNLU',
        '',
        bpBio,
        'adhoc'
      ]
    );
    const bpId = bpResult.insertId;

    const bpExp = [
      ['Director / Chair Professor - Human Rights Law', 'KIIT School of Law, Bhubaneswar', 'Jan 2021 - 2025', 'teaching', 1],
      ['Professor of Eminence (Law)', 'Damodaram Sanjivayya National Law University (DSNLU), Visakhapatnam', 'May 2019 - Jan 2021', 'teaching', 2],
      ['Visiting Professor', 'Law School, KITTS, Bhubaneswar', 'May 2019 - Jan 2021', 'teaching', 3],
      ['Founder Vice-Chancellor', 'Maharashtra National Law University (MNLU), Mumbai', 'Oct 2014 - June 2018', 'other', 4],
      ['Dean, Faculty of Legal Studies', 'Berhampur University', 'March 2013 - Oct 2014', 'teaching', 5],
      ['Chairman, Board of Studies (Law)', 'Berhampur University', 'Oct 2012 - Oct 2014', 'teaching', 6],
      ['Professor', 'PG Department of Law, Berhampur University', 'July 2010 - Oct 2014', 'teaching', 7],
      ['Professor', 'The West Bengal National University of Juridical Sciences, Kolkata', 'April 2009 - July 2010', 'teaching', 8],
      ['Coordinator (LL.M Distance Ed)', 'Berhampur University', 'Aug 2007 - April 2009', 'teaching', 9],
      ['Professor', 'PG Department of Law, Berhampur University', 'Sept 2004 - Oct 2014', 'teaching', 10],
      ['Coordinator (PG Diploma in Disaster Mgt)', 'Berhampur University', 'Aug 2005 - May 2009', 'teaching', 11],
      ['Head of the Department', 'PG Department of Law, Berhampur University', 'June 2002 - May 2004', 'teaching', 12],
      ['Principal', 'Lingaraj Law College, Berhampur University', 'Jan 2002 - Feb 2003', 'teaching', 13],
      ['Reader', 'Post-Graduate Department of Law, Berhampur University', 'Oct 2001 - Sept 2004', 'teaching', 14],
      ['Associate Professor (On lien)', 'The West Bengal National University of Juridical Sciences, Kolkata', 'Jan 2001 - Oct 2001', 'teaching', 15],
      ['Reader', 'Post-Graduate Department of Law, Berhampur University', 'Sept 1994 - Jan 2000', 'teaching', 16],
      ['Senior Lecturer', 'M.S. Law College, Utkal University', 'Oct 1994 - Sept 1996', 'teaching', 17],
      ['Principal', 'NBM Law College', 'April 1989 - Oct 1994', 'teaching', 18],
      ['Lecturer', 'NBM Law College', 'March 1988 - Oct 1994', 'teaching', 19]
    ];
    for (let exp of bpExp) {
      await pool.query(`INSERT INTO faculty_experience (faculty_id, title, institution, period, type, display_order) VALUES (?, ?, ?, ?, ?, ?)`, [bpId, ...exp]);
    }

    const bpPubs = [
      ['book', 'Festschrift: Current Legal Issues (Edtd)', 'ALERT, Berhampur, Orissa', '2003', 'Dr. B P Panda', 1],
      ['article', 'Child Sexual Abuse: The Problems of Definition and Proof in the Criminal Justice Administration (Page 225-244)', 'Law and Child', '2004', 'Book Chapter', 2],
      ['article', 'Women’s Rights and Human Rights Law (Page 12-37)', 'Girl Child and Human Rights, Anmol Publications', '2005', 'Book Chapter', 3],
      ['article', 'Law and Economics of Human Rights and Development (Page 114-147)', 'Human Rights, Development, and Environment Law – An Analogy', '2006', 'Book Chapter', 4],
      ['article', 'Corporate Environmentalism-E’-Litigation: Responses from ADR Technique', 'Environmental Management (Deep and Deep)', '2007', 'Book Chapter', 5],
      ['book', 'Human Rights, Development and Environment Law', 'Academic Excellence, New Delhi', '2007', '', 6],
      ['book', 'Factory Crimes and Punishment', 'Academic Excellence, New Delhi', '2008', 'Co-authored with Minati Panda', 7],
      ['book', 'Legal Response to Disaster Management', 'Disaster Management Course Centre, Berhampur University', '2009', '', 8],
      ['book', 'Case Study- Response Action of Odisha Fire Service during Phailin 2013', '', '2014', '', 9],
      ['article', 'Summary: Published books: 3, Monograph: 1, Research articles: 33, Papers: 36', 'Total Output', '', '', 10]
    ];
    for (let pub of bpPubs) {
      await pool.query(`INSERT INTO faculty_publications (faculty_id, type, title, journal_book_name, year, details, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [bpId, ...pub]);
    }

    // 25. Mr. R.V Vishnu kumar
    console.log('Seeding Mr. R.V Vishnu kumar...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['r-v-vishnu-kumar']);

    const vkBio = `He has Law degree from ILS Law College, Pune and Masters Degree from Pune University. His specialization is Interpretation of statutes. He secured 2nd has specialized in Criminal Law and Taxation Law. He has qualified NET. He has worked as a legal advisor to corporate and Govt. of India Undertaking. His other area of interest is Alternate Dispute Resolution, particularly Arbitration. He has wide exposure and experience in coordinating and participating in Domestic Arbitrations and Joint Venture Arbitration (JVA), having assisted the Additional Solicitor General of India, (ASG) on behalf of the Corporate, before a panel consisting of Chief Justice of India and other Judges of Supreme Court of India. He is the member of the Women Grievance at Work Place Committee.`;

    const [vkResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Mr. R.V Vishnu kumar',
        'r-v-vishnu-kumar',
        'Assistant Professor',
        'https://dsnlu.ac.in/storage/2022/12/Mr.-Vishnu-Kumar.jpg',
        'LL.M.',
        '',
        '',
        'Assistant Professor, Damodaram Sanjivayya National Law University',
        'Interpretation of statutes, Criminal Law, Taxation Law, Alternate Dispute Resolution, Arbitration',
        vkBio,
        'regular'
      ]
    );
    const vkId = vkResult.insertId;

    const vkExp = [
      ['Assistant Professor', 'Damodaram Sanjivayya National Law University', 'Present', 'teaching', 1],
      ['Legal Advisor', 'Corporate and Govt. of India Undertaking', '', 'other', 2]
    ];
    for (let exp of vkExp) {
      await pool.query(`INSERT INTO faculty_experience (faculty_id, title, institution, period, type, display_order) VALUES (?, ?, ?, ?, ?, ?)`, [vkId, ...exp]);
    }

    // 26. Dr. B. Surekha Reddy
    console.log('Seeding Dr. B. Surekha Reddy...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['b-surekha-reddy']);

    const [srResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Dr. B. Surekha Reddy',
        'b-surekha-reddy',
        'Assistant Professor',
        'https://dsnlu.ac.in/storage/2026/01/Dr.-Surekha-Reddy.jpg',
        '',
        '',
        '',
        'Assistant Professor, Damodaram Sanjivayya National Law University',
        '',
        '',
        'regular'
      ]
    );

    // 27. Dr. T. Y. Nirmala Devi
    console.log('Seeding Dr. T. Y. Nirmala Devi...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['t-y-nirmala-devi']);

    const ndBio = `She has 30+ years of experience teaching political science since 1994. She has been teaching Political theory and Organisation, and Theory of International Relations at DSNLU from 2009. She graduated from Andhra University with an M.A. in Political Science, an M.B.A., and a PhD. She published several articles in national and international journals. She participated and presented a number of papers in National and International seminars and workshops. She has administrative skills. Presently she serves as a member of the Anti-Ragging and member of the Mess Complaints committee. She is also the co-director of a minor project approved by the ICSSR, New Delhi, titled “The study of digitization and modernization of land records in India with special reference to Visakhapatnam District in the state of Andhra Pradesh”.`;

    const [ndResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Dr. T. Y. Nirmala Devi',
        't-y-nirmala-devi',
        'Faculty - Political Science',
        'https://dsnlu.ac.in/storage/2022/12/Dr.-Nirmala.jpg',
        'M.A., M.B.A., Diploma in IRPM., Ph.D.',
        '',
        'tynirmaladevi@dsnlu.ac.in',
        'Faculty - Political Science, Damodaram Sanjivayya National Law University',
        'Political theory and Organisation, Theory of International Relations',
        ndBio,
        'regular'
      ]
    );
    const ndId = ndResult.insertId;

    const ndExp = [
      ['Faculty - Political Science', 'Damodaram Sanjivayya National Law University', '2009 - Present', 'teaching', 1],
      ['Teaching Political Science', 'Various Institutions', '1994 - 2009', 'teaching', 2]
    ];
    for (let exp of ndExp) {
      await pool.query(`INSERT INTO faculty_experience (faculty_id, title, institution, period, type, display_order) VALUES (?, ?, ?, ?, ?, ?)`, [ndId, ...exp]);
    }

    const ndPubs = [
      ['article', 'An analysis on POSH Act – Sexual Harassment of Women at Workplace and its Discrimination in India', 'Role of laws, Justice and Human Rights in India', '2025', '', 1],
      ['article', 'International Instruments on Mental Health – A Brief Note', 'We the People DSNLU Journal of Social Sciences', '2023', '', 2],
      ['article', 'Legitimacy of Social Contract Theory in Contemporary Political Situation', 'Democracy and Governance in the 21st Century', '2022', '', 3],
      ['article', 'Natural flows and Artificial Boundaries: An Insight into India – Pakistan', 'Water Conflicts in managing the Blue', '2022', '', 4],
      ['article', 'The Crises of COVID-19 and its impact on Indian politics: An Insight', 'Managing pandemics: India’s Responses to COVID-19', '2022', '', 5],
      ['article', 'Gun Culture and Mental Illness – Myths and Realities', 'Law and Mental Health (Clinic to Community Care)', '2021', '', 6],
      ['article', 'Dr.B.R.Ambedkar Contribution on Empowerment of Women in India-An Analysis', 'Aayushi International Interdisciplinary Research Journal', '2021', '', 7],
      ['article', 'Impact of Globalization on Higher Education in India-Challenges and opportunities', 'Quality and Research in Higher Education', '2020', '', 8],
      ['article', 'Relevance of Dr.B.R.Ambedkar views on Education and Social Change in Modern India', 'Relevance of Ambedkarism for Social Transformation in Contemporary India', '2019', '', 9],
      ['article', 'Yoga for Stress Management & Relaxation – An Insight', 'The International Journal of Academic Research', '2017', '', 10],
      ['article', 'Views on Dr. B. R. Ambedkar on Democracy and its relevance in contemporary Indian scenario – A Critical Analysis', 'International Journal of Academic Research', '2017', '', 11],
      ['article', 'Women as Decision Makers in Panchayati Raj Institutions in India-Perspectives and challenges', 'UGC approved journal No: 47663', '2018', '', 12],
      ['article', 'Mahatma Gandhi, the Father of Environmental Movement in India – An Insight', 'International Journal of Academic Research', '2016', '', 13],
      ['article', 'The Space of Civil Society & The United Nations Human Rights System – A Critical Analysis', 'The International Journal of Academic Research', '2015', '', 14],
      ['article', 'The Saga of Panchayati Raj institutions in India', 'IJMER', '2013', '', 15],
      ['article', 'Five Years of Protection of Women from Domestic Violence Act, 2005', 'The Legal Analyst', '2012', '', 16],
      ['article', 'Forest Regulations and Forest Dwellers Rights', 'Chotanagapur Law Journal', '2011', '', 17],
      ['article', 'Evolution of women’s Rights to Education in India', 'Journal of Academy of Judicial Studies', '2012', '', 18],
      ['article', 'Impact of De-linking Irretrievable Ground Breakdown and Marital Property: A few Reflections', 'The Legal Analyst', '2011', '', 19]
    ];
    for (let pub of ndPubs) {
      await pool.query(`INSERT INTO faculty_publications (faculty_id, type, title, journal_book_name, year, details, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [ndId, ...pub]);
    }

    const ndConf = [
      ['National Webinar to observe the International Day for Elimination of Violence against Women', 'DSNLU / Gender Champions Committee', 'Nov 2021', 'national', 'Organized', 1],
      ['E-Round Table Conference on Best practices of promoting Gender Equality', 'DSNLU / Gender Champions Committee', 'Sept 2020', 'national', 'Organized', 2],
      ['National Seminar on ILO and Child Rights', 'DSNLU', 'Sept 2019', 'national', 'Organized', 3],
      ['State Level Webinar on From Shop to Screen: Consumer Protection', 'S. R. Fatepuria College', 'Dec 2025', 'national', 'Participated', 4],
      ['State Level Webinar on Gandhi’s lessons for youth today', 'S. R. Fatepuria College', 'Oct 2025', 'national', 'Participated', 5],
      ['National Level Webinar on The Importance of National Security', 'S. R. Fatepuria College', 'July 2025', 'national', 'Participated', 6],
      ['National Level Webinar on Why July 17 Matters to all of us', 'S. R. Fatepuria College', 'July 2025', 'national', 'Participated', 7],
      ['International Webinar on The Role of Social Media and AI in Combating Violence against Women', 'Plassey College', 'Nov 2024', 'international', 'Participated', 8],
      ['National Level Webinar on Shaping New India with IKS', 'S. R. Fatepuria College', 'Nov 2024', 'national', 'Participated', 9],
      ['Webinar on Bharatiya Sakshya Adhiniyam', 'Central University of Karnataka', 'May 2024', 'national', 'Participated', 10],
      ['Webinar on Bharatiya Nagarik Suraksha Sanhita', 'Central University of Karnataka', 'May 2024', 'national', 'Participated', 11],
      ['International Training Programme - Environmental Pollution', 'Raj Rishi Govt Autonomous College', 'Aug 2023', 'international', 'Participated', 12],
      ['International Training Programme - Energy and Environment Conservation', 'Raj Rishi Govt Autonomous College', 'April 2023', 'international', 'Participated', 13],
      ['International Training Programme - Biodiversity', 'Raj Rishi Govt Autonomous College', 'March 2023', 'international', 'Participated', 14],
      ['International Training Programme - Greener Living: Reduce, Reuse and Recycle', 'Raj Rishi Govt Autonomous College', 'Feb 2023', 'international', 'Participated', 15],
      ['National One Day Workshop on Research Methodology and Plagiarism', 'Swami Ramanand Teerth Mahavidyalaya', 'Jan 2023', 'national', 'Participated', 16],
      ['International Training Programme - Chemicals and Toxins', 'Raj Rishi Government Autonomous College', 'Dec 2022', 'international', 'Participated', 17],
      ['International Training Programme - Methods, Modeling, Data and Tools', 'Raj Rishi Government Autonomous College', 'Nov 2022', 'international', 'Participated', 18],
      ['Workshop on Importance of International Humanitarian Law', 'DSNLU / ICRC', 'Sept 2022', 'international', 'Participated', 19],
      ['Training Programme on Women Rights & Human Rights', 'Manikchand Pahade Law College / NHRC', 'Aug 2022', 'national', 'Participated', 20],
      ['Online workshop on Improving Scientific Research Writing and Publication Skills', 'RKDF University', 'April 2022', 'national', 'Participated', 21],
      ['National Webinar on Women and Human Rights: New Dynamics', 'S R Fatepuria College', 'March 2022', 'national', 'Participated', 22],
      ['State Level Webinar on B.R.Ambedkar and nationality', 'Karnataka State Open University', 'Jan 2022', 'national', 'Participated', 23],
      ['National Level Lecture Series on Constitution of India', 'Kakatiya University', 'Dec 2021', 'national', 'Participated', 24],
      ['National Webinar on India’s Security Challenges in 21st Century', 'Sambalpur University', 'Sept 2021', 'national', 'Participated', 25],
      ['National Webinar on Mapping Traditional Museums', 'Doomdooma College', 'June 2021', 'national', 'Participated', 26],
      ['National Webinar on Global Compact on Refugees', 'VIT-AP / UNHCR', 'June 2021', 'national', 'Participated', 27],
      ['National Webinar on Evolution of Advertisement in India', 'Doomdooma College', 'June 2021', 'national', 'Participated', 28],
      ['National webinar on Methods and Praxis on Social Sciences Research', 'Mother Theresa College', 'June 2021', 'national', 'Participated', 29],
      ['National Workshop on Socio-Religious Institutions', 'Kakatiya University', 'April 2021', 'national', 'Participated', 30],
      ['National Webinar on New Trends in Historical Writing', 'P.G.Govt Arts College', 'March 2021', 'national', 'Participated', 31],
      ['Safe Campus Programme', 'Association of Indian Universities', 'Feb 2021', 'national', 'Participated', 32],
      ['International webinar on The importance of Research Ethics', 'Govt. Swami Vivekanand College', 'Feb 2021', 'international', 'Participated', 33],
      ['International Webinar on Vasudhaiva Kutumbam', 'Kishore Bharati Bhagini Nivedita College', 'Feb 2021', 'international', 'Participated', 34],
      ['National Webinar on Impact of COVID-19 on Environment', 'Pankaj Arts and Science College', 'Jan 2021', 'national', 'Participated', 35],
      ['National Level Webinar on National Educational Policy 2020', 'SVM arts, Science and Commerce College', 'Jan 2021', 'national', 'Participated', 36],
      ['National Webinar on Thoughts of Dr. Babasaheb Ambedkar on National Security', 'Pankaj Arts and Science College', 'Jan 2021', 'national', 'Participated', 37],
      ['Webinar on 151st Gandhi Jayanthi Celebrations', 'University of Madras', 'Oct 2020', 'national', 'Participated', 38],
      ['International Webinar on Tackling Pandemic World', 'ADAMAS University', 'Oct 2020', 'international', 'Participated', 39],
      ['Webinar on Ghandhian Philosophy and Contemporary Challenges', 'University of Allahabad', 'Oct 2020', 'national', 'Participated', 40],
      ['National Workshop on National Education Policy 2020', 'Swami Ramanand Teerth Marathwada University', 'Oct 2020', 'national', 'Participated', 41],
      ['Al-Haj P K Kunju Sahib Memorial Webinar Series 2020-2021', 'Milad-E-Sherief Memorial College', 'Aug 2020', 'national', 'Participated', 42],
      ['Webinar on Commodity Derivatives Market', 'Sree Vidyanikethan Institute of management', 'Aug 2020', 'national', 'Participated', 43],
      ['Al-Haj P K Kunju Sahib Memorial Webinar Series', 'Milad-E-Sherief Memorial College', 'Aug 2020', 'national', 'Participated', 44],
      ['National Webinar on Animal Welfare: Socio – Legal Aspects', 'ICFAI University', 'July 2020', 'national', 'Participated', 45],
      ['National Webinar on Introducing Skill Oriented Courses', 'APSCHE', 'July 2020', 'national', 'Participated', 46],
      ['National Webinar on Constitutional Amendments', 'KES Shri. Jayantilal H. Patel Law College', 'July 2020', 'national', 'Participated', 47],
      ['National Level Online Quiz on Political Science', 'Government Degree College', 'June 2020', 'national', 'Participated', 48],
      ['Online Webinar on Challenges of Teaching in a Virtual Class Room', 'MRK Institute of Technology', 'June 2020', 'national', 'Participated', 49],
      ['Interaction on Art of Converting Crises into Opportunities', 'The Hindu College', 'June 2020', 'national', 'Participated', 50],
      ['Webinar on Virtual Library Services', 'DSNLU / AILL', 'June 2020', 'national', 'Participated', 51],
      ['National Level Online Seminar on Sustainable Challenges in Post COVID', 'Government First Grade College', 'June 2020', 'national', 'Participated', 52],
      ['International Webinar on Context Based Pedagogy', 'Central University of Haryana', 'June 2020', 'international', 'Participated', 53],
      ['National Webinar on Impact of COVID 19', 'Tumkur University', 'May 2020', 'national', 'Participated', 54],
      ['Two Day Online Workshop on Modern Methods for Teaching – Learning Practices', 'Krishna University', 'May 2020', 'national', 'Participated', 55],
      ['Seven Days Wildlife Week & International Colloquium', 'Maharaja Ganga Singh University', 'Oct 2024', 'international', 'Participated', 56],
      ['Open House Discussion on Rights of Fishermen', 'NHRC / DSNLU', 'Aug 2024', 'national', 'Participated', 57],
      ['Interdisciplinary Refresher Course in Advanced Research Methodology', 'Ramanujan College, University of Delhi', 'June 2023', 'national', 'Participated', 58],
     ['International Online Workshop on Teaching and Research Capacity Building', 'Mahatma Gandhi University', 'July 2022', 'international', 'Participated', 59],
     ['International FDP on Yoga and Meditation on Human Excellence', 'Sree Vidyanikethan', 'Feb 2022', 'international', 'Participated', 60],
     ['FDP on Transformation in Indian Education through New Education Policy', 'Government First Grade College for Women', 'July 2021', 'national', 'Participated', 61],
     ['Induction/Orientation Programme for Faculty in Universities', 'Ramanujan College, University of Delhi', 'June 2020', 'national', 'Participated', 62],
     ['National FDP on Data Analysis for Research in Social Sciences', 'Ramanujan College', 'June 2020', 'national', 'Participated', 63],
     ['International FDP on Enhancing Digital Proficiency', 'Adikavi Nannaya University', 'Aug 2020', 'international', 'Participated', 64],
     ['Online FDP on Law and the Vulnerable', 'Karnataka State Law University', 'Aug 2020', 'national', 'Participated', 65],
     ['Workshop on NAAC Revised Accreditation Framework', 'GHG Khalsa College of Education', 'Aug 2020', 'national', 'Participated', 66],
     ['National Level FDP Exploring the Facts in Writing a Research Article', 'St.Joseph’s Degree College', 'June 2020', 'national', 'Participated', 67],
     ['Online FDP on Impact of COVID 19 on Indian Economy', 'Rani Channamma University', 'May 2020', 'national', 'Participated', 68]
    ];
    for (let c of ndConf) {
      await pool.query(`INSERT INTO faculty_conferences (faculty_id, title, details, date, type, role, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [ndId, ...c]);
    }

    // 28. Mr. R. V Prasad
    console.log('Seeding Mr. R. V Prasad...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['r-v-prasad']);

    const [rpResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Mr. R. V Prasad',
        'r-v-prasad',
        'Faculty - Sociology',
        'https://dsnlu.ac.in/storage/2024/10/Mr.-R.V.-Prasad-1.png',
        '',
        '',
        '',
        'Faculty - Sociology, Damodaram Sanjivayya National Law University',
        '',
        '',
        'regular'
      ]
    );

    // 29. Dr. Sarita Rani Chukka
    console.log('Seeding Dr. Sarita Rani Chukka...');
    await pool.query('DELETE FROM faculties WHERE slug = ?', ['sarita-rani-chukka']);

    const scBio = `Dr. Sarita Rani Chukka is an Assistant Professor of English at Damodaram Sanjeevayya National Law University, where she has been serving since June 2024. She was awarded a Ph.D. in English in 2022 from Andhra University. She completed her M.Phil in English in 2015 and M.A. in English in 2011 from the same university.

She has over a decade of teaching experience in higher education. From October 2014 to May 2024, she worked as a Guest Faculty in English in the Department of Humanities and Social Sciences at A.U. College of Engineering (A), Andhra University. During this period, she taught undergraduate and postgraduate courses including English, Soft Skills, Research Methodology, Research Paper Writing, and Value Education. Since June 2024, she has been teaching English at the undergraduate level at Damodaram Sanjeevayya National Law University.

Dr. Chukka’s academic and research interests include English Language Teaching and value-based education. She has published research articles in reputed national and international journals between 2015 and 2025, contributing significantly to interdisciplinary academic discourse.

She qualified the Andhra Pradesh and Telangana State Eligibility Test (SET) in English in 2012, the UGC NET in Education in 2014, and the SET in Education in 2015. To enhance her pedagogical skills, she completed a Post Graduate Diploma in Teaching English (PGDTE) from the English and Foreign Languages University (EFLU), Hyderabad, in 2018.`;

    const [scResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Dr. Sarita Rani Chukka',
        'sarita-rani-chukka',
        'Assistant Professor / Faculty - English',
        'https://dsnlu.ac.in/storage/2024/10/Dr.-Saritha-Rani.png',
        'Ph.D., M.Phil., M.A., PGDTE in English',
        '',
        '',
        'Assistant Professor of English, Damodaram Sanjeevayya National Law University',
        'English Language Teaching, value-based education',
        scBio,
        'regular'
      ]
    );
    const scId = scResult.insertId;

    const scExp = [
      ['Assistant Professor of English', 'Damodaram Sanjeevayya National Law University', 'June 2024 - Present', 'teaching', 1],
      ['Guest Faculty in English', 'A.U. College of Engineering (A), Andhra University', 'Oct 2014 - May 2024', 'teaching', 2]
    ];
    for (let exp of scExp) {
      await pool.query(`INSERT INTO faculty_experience (faculty_id, title, institution, period, type, display_order) VALUES (?, ?, ?, ?, ?, ?)`, [scId, ...exp]);
    }

    const scPubs = [
      ['article', 'Listening Skills in Language Learning: A Study', 'International Journal of Multidisciplinary Educational Research', '2015', 'Vol 4, Issue 4(4)', 1],
      ['article', 'Social Inclusion of Street Vendors in Market Economy: A Study with reference to Visakhapatnam District', 'International Journal for Multidisciplinary Research', '2025', 'Vol 7, Issue 1', 2],
      ['article', 'Relevance of Gandhian Economic Thought', 'Gandhian Vision (International Journal Of Peace & Gandhian Studies)', '2016', 'Vol 3, Issue 1', 3],
      ['article', 'Participatory Politics in the Digital Era – An English Drama Perspective – A Gandhian View', 'Gandhian Approach to Participatory Politics in the Digital Era', '2025', 'Book Chapter', 4],
      ['article', 'Ethical Governance through a Gandhian Approach: Insights from English Drama', 'Constructive Politics and Ethical Governance : A Gandhian Approach', '2025', 'Book Chapter', 5],
      ['article', 'Social Inclusion: Dimensions and Importance', 'Understanding Emerging Challenges in Social Inclusion in India', '2025', 'Book Chapter', 6],
      ['article', 'Bonded Labour and Trafficking of Children : A Hidden Reality', 'Child Labour Eradication in India A Way Forward', '2025', 'Book Chapter', 7],
      ['article', 'Innovative Teaching and Research Practices in Higher Educational Institutions for Sustainable Development', 'Innovative Teaching and Research Practices in Higher Educational Institutions for Sustainable Development', '2023', 'Book Chapter', 8],
      ['article', 'Rural Development in Gandhian Perspective', 'Gandhian approach to Rural Development and Communication', '2017', 'Book Chapter', 9],
      ['article', 'The Confront Of Good Governance in India: Need For Innovative Approach', 'An Appraisal of Globalization and Governance in Gandhian Perspective', '2017', 'Book Chapter', 10],
      ['article', 'Gandhi and Religion', 'Gandhian Philosophy Its Relevance Today', '2017', 'Book Chapter', 11]
    ];
    for (let pub of scPubs) {
      await pool.query(`INSERT INTO faculty_publications (faculty_id, type, title, journal_book_name, year, details, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`, [scId, ...pub]);
    }

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

run();
