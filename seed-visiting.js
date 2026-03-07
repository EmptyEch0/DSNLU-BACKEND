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

async function seedVisitingFaculty() {
  const pool = mysql.createPool(dbConfig);
  try {
    console.log("Starting Visiting Faculty seeding process...");

    // 1. Prof. (Dr.) David Ambrose
    console.log("Seeding Prof. (Dr.) David Ambrose...");
    await pool.query("DELETE FROM faculties WHERE slug = ?", ["david-ambrose"]);
    
    const daBio = `Prof. (Dr.) David Ambrose is a distinguished Professor of Law with over 22 years of PG teaching experience and 7+ years serving as Head of the Department of Legal Studies at the University of Madras. He holds a B.Sc. in Zoology, a B.L., an M.L. securely finishing First Rank (L.C. Miller Medal), and a Ph.D. in 'International Law of Compensation for Nationalization of Foreign Property'. 

His illustrious career includes his roles as Dean of Legal Affairs, President Faculty of Law, Campus Director, and Special Officer for Examinations at the University of Madras. He has actively guided over 160 M.L. Dissertations and 31 Ph.D. Scholars, contributing deeply to the legal academic corpus. Prof. Ambrose was awarded The Hague 1993 Doctoral Scholarship and participated in a 4-week Advanced Teachers' Training Course at Cardiff University, UK. 

He serves as an Expert Member for UGC, UGC 12 B Committees, and NAAC across prestigious Law Schools like HNLU, RGNLU, NUALS, TNNLU, ILS Pune, NLSU Bangalore, and NALSAR. His core specializations are Public International Law, Private International Law (Conflict of Laws), Constitutional Law, Human Rights Law, and Cyber Law.`;

    const [daResult] = await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "Prof. (Dr.) David Ambrose",
        "david-ambrose",
        "Visiting Faculty",
        "https://dsnlu.ac.in/storage/2023/12/david.png",
        "Ph.D., M.L., B.L., B.Sc.",
        "",
        "",
        "Distinguished Visiting Professor",
        "Public International Law, Private International Law, Constitutional Law, Human Rights, Environmental Law, Cyber Law",
        daBio,
        "visiting"
      ]
    );
    const daId = daResult.insertId;

    const daExp = [
      ["Head of the Department", "Department of Legal Studies, University of Madras", "April 2013 - June 2020", "administrative", 1],
      ["Dean, Legal Affairs", "University of Madras", "Nov 2012 - June 2020", "administrative", 2],
      ["President Faculty of Law", "University of Madras", "July 2013 - June 2020", "administrative", 3],
      ["Professor", "Department of Legal Studies, University of Madras", "June 2009 - June 2020", "teaching", 4],
      ["Reader", "Department of Legal Studies, University of Madras", "Nov 2002 - June 2009", "teaching", 5],
      ["Senior Lecturer", "Department of Legal Studies, University of Madras", "Nov 2000 - Nov 2002", "teaching", 6],
      ["Lecturer in Law (Sr. Scale)", "Dr. Ambedkar Govt. Law College, Madras", "Jan 1997 - Sept 1997", "teaching", 7],
      ["Advocate", "High Court of Madras", "1989 - 1995", "other", 8]
    ];
    for (const exp of daExp) {
      await pool.query("INSERT INTO faculty_experience (faculty_id, title, institution, period, type, display_order) VALUES (?, ?, ?, ?, ?, ?)", [daId, ...exp]);
    }

    const daPubs = [
      ["book", "Concept of Property and Law: New Developments (Co-Edited)", "Department of Legal Studies, University of Madras", "2017", "ISBN: 978 93-81-992-48-7", 1],
      ["book", "Marriage: Changing Trends (Co-Edited)", "Today Publications", "2016", "ISBN: 978 93-81-992-41-8", 2],
      ["book", "Environmental Law (Co-Authored)", "Prabha Publications", "2001", "", 3],
      ["book", "India and WTO (Co-Edited)", "Madras", "1996", "", 4],
      ["book", "Administrative Law (English Medium) for Diploma", "Distance Education Madurai Kamaraj University", "2000", "", 5],
      ["book", "Administrative Law (Tamil Medium) for Diploma", "Distance Education Madurai Kamaraj University", "2000", "", 6],
      ["book", "Fundamental Rights (Study Material)", "IDE University of Madras", "2001", "", 7],
      ["book", "Paper III on Human Rights and International Trade (Study Material)", "Distance Education Pondicherry University", "2001", "", 8],
      ["article", "Patent Waiver: A Vaccine for Vaccine Patents", "TNDALU - IPLR", "2021", "pp 15-26", 9],
      ["article", "Toward Realization of Human rights: Grave violations of Human Rights and Responsibility to Protect", "Journal of the Department of Legal Studies", "2020", "Vol. 38-42, pp 62-72", 10],
      ["article", "Significance of North-South Dialogue: Then and Now", "North-South Imbalances in Global Arena", "2020", "pp 13-15", 11],
      ["article", "Internationalization of Grave Violations of Human Rights and Changing Dimensions of State Sovereignty", "Human Rights and Constitutional Governance", "2019", "pp 27-32", 12],
      ["article", "Democratic Constitution and Broadening the Contours of Freedom of Speech and Expression", "CSI Law Journal", "2018", "Vol 1, pp 110-123", 13],
      ["article", "Refugee Protection: An Indian Perspective", "Global Crisis A Contemporary Reflection", "2018", "pp 185-196", 14],
      ["article", "Order, Order, Order: Postponement of Publication Orders and Judicial Ordering", "TNNLU Law Review", "2018", "Vol 1, pp 73-81", 15],
      ["article", "Feminist Jurisprudence and Gender Justice: An Indian Experience", "International Journal of Law, Education, Social and Sports Studies", "2018", "Vol.5 S1, pp 1-8", 16],
      ["article", "Pharma Patents and Novartis Judgment: Taming the Unruly Horse", "JMGCL", "2017", "pp 52-58", 17],
      ["article", "Scope and Significance of ADR in Family Law", "Alternate Dispute Resolution in India", "2017", "pp 1-8", 18],
      ["article", "New Challenges to Human Rights and Ethical Values in Human Rights Education", "Human Rights Constitutionalism and Rule of Law", "2017", "pp 131-144", 19],
      ["article", "Distributive Justice, Sustainable Development and the Constitutional Frame Work", "Law Development and Justice", "2017", "pp 66-78", 20],
      ["article", "Assignment of Intangible Movables under Private International Law", "Concept of Property and Law", "2017", "pp 1-6", 21],
      ["article", "Law Relating to Marine Pollution with Special Reference to Ocean Fertilization", "International Journal of Law, Education, Social and Sports Studies", "2017", "Vol 4, pp 1-7", 22],
      ["article", "Control Over Legal Education", "Legal Education in the 21st Century", "2017", "pp 1-10", 23],
      ["article", "Rule of Law and Human Rights: How They Interact?", "Justice Triumphs", "2016", "pp 559-568", 24],
      ["article", "Law Relating to Extra-Territorial Marriages", "Marriage: Changing Trends", "2016", "pp 5-9", 25],
      ["article", "Prohibition of Forcible Conversion of Religion \u2013 The Tamil Nadu Experience", "Constitutional Status of Religious Conversions in India", "2016", "pp 96-106", 26],
      ["article", "Preclusion of Sovereign Immunity and the Theories of Sovereign Immunity", "Bangalore University Law Journal", "2015", "Vol 5 (4), pp 78-91", 27],
      ["article", "Sensitizing Human Rights and Third World Countries", "Karnataka State Law University Journal", "2016", "Vol IV, pp 9-22", 28],
      ["article", "Ambedkar\u2019s Ideology on Democracy and Its Present-Day Relevance", "Crystals of Dr. Ambedkar\u2019s Thought", "2015", "pp 144-159", 29],
      ["article", "Utilization of Biological Resources and ABS", "ITMU Law Review", "2015", "Vol. 1 (1), pp 1-13", 30],
      ["article", "Dishonouring the Honour Killings: The Role of Judiciary", "Journal of the Department of Legal Studies", "2015", "Vol. 35-37, pp 95-106", 31],
      ["article", "Public Participation in Sustainable Use and Conservation of Biological Resources", "Kerala University Journal of Legal Studies", "2013", "Vol VI, pp 1-12", 32],
      ["article", "Directive Principles of State Policy and Distribution of Material Resources", "Journal of the Indian Law Institute", "2013", "Vol. 55 No. 1, pp 1-20", 33],
      ["article", "Enabling the Disabled: Human Rights Approach to Disability", "The Year Book of Legal Studies", "2012", "Vol 32-34, pp 70-85", 34],
      ["article", "Harmonization of CBD and WTO", "Indian Journal of International Law", "2012", "Vol 52 No.4, pp 515-539", 35],
      ["article", "Intellectual Property Rights and Sustainable Development", "The Year Book of Legal Studies", "2009", "Vol 31, pp 50-61", 36],
      ["article", "From Charity to Right: Education, Law and Judiciary", "The Year Book of Legal Studies", "2008", "Vol 30, pp 12-30", 37],
      ["article", "Human Rights Aspect of Female Feticide", "The Year Book of Legal Studies", "2007", "Vol 29, pp 20-28", 38],
      ["article", "Abortion: A Basic Human Right?", "Legal Opus Journal of SDM Law College", "2007", "Vol 2, pp 5-13", 39],
      ["article", "Patenting of Life Forms", "Legal Opus Journal of SDM Law College", "2007", "Vol 1, pp 49-61", 40],
      ["article", "Impact of TRIPS Agreement on Indian Patent Law", "Intellectual Property Rights", "2006", "pp 244-256", 41],
      ["article", "Law relating to Adoption of Indian Children by Foreigners", "Woman Child Law and Society", "2006", "pp 251-261", 42],
      ["article", "Economic Dimensions of Law: Some Constitutional Reflections", "The Bangalore Law Journal", "2005", "Vol 1, pp 82-92", 43],
      ["article", "International Environmental Law and India", "India and International law", "2005", "pp 249-264", 44],
      ["article", "Thirukural and the Protection of Environment", "India and Human Rights Reflections", "2005", "pp 82-91", 45],
      ["article", "Protection of Non-Economic Intellectual Property Rights", "The Year Book of Legal Studies", "2004", "Vol 26, pp 1-6", 46],
      ["article", "State Terrorism and International Law", "Terrorism Challenges and Remedies", "2004", "pp 55-62", 47],
      ["article", "Human Rights and IPR", "Symbiosis Society\u2019s Law College Special Issue", "2004", "pp 12-24", 48],
      ["article", "Law of Confession and Right against Torture", "Criminal Justice", "2004", "pp 243-256", 49],
      ["article", "Cybersquatting and Online Trade Mark /Cyber Mark Protection", "Andhra University Law Journal", "2003", "Vol 4, pp 113-124", 50],
      ["article", "The Right to Reparation for Victims of Violations of International Human Rights", "Journal of the Institute of Human Rights", "2003", "Vol VI (1), pp 26-36", 51],
      ["article", "Affirmative Action and the Concept of Equality under Article 14", "Constitutional Jurisprudence", "2002", "pp 510-530", 52],
      ["article", "National and International Protection of Geographical Indications", "Constitutional Jurisprudence", "2002", "pp 823-836", 53],
      ["article", "Public Trust Doctrine as the Basis of Environmental Jurisprudence", "Kerala University Journal of Legal Studies", "2002", "Vol 2, pp 39-48", 54],
      ["article", "Doctrine of Fair Use in Online Software Copyright Protection", "Copyright Law", "2001", "pp 17-27", 55],
      ["article", "Obligations of Higher Judiciary, Judicial Power and Accountability", "Judicial Independence and Accountability", "2001", "pp 44-53", 56],
      ["article", "Cyber Piracy and the Doctrine of Fair Use", "Law of Copyright", "2001", "pp 64-74", 57],
      ["article", "Development of Municipal Law through International Law", "Souvenir and Conference Papers", "2001", "Vol I, pp 52-61", 58],
      ["article", "International and National Protection of Trade Marks", "SBRRM Journal of Law", "2001", "Vol 8 (1), pp 12-22", 59],
      ["article", "Green Crimes' Need Red Signal", "Year Book of Legal Studies", "2000", "Vol 23, pp 21-34", 60],
      ["article", "Social Justice through Environmental Protection: The Role of Indian Judiciary", "Fifty Years of Indian Independence", "2000", "pp 95-111", 61],
      ["article", "Protection and Promotion of Human Rights: The Role of Media", "Studies in Human Rights", "2000", "pp 234-243", 62],
      ["article", "Human Rights Approach to Refugee Problem- A Midas Touch?", "SBRRM Journal of Law", "2000", "Vol 7 (1), pp 9-21", 63],
      ["article", "Implication of Globalization on Legal Education", "Legal Education in India", "1999", "pp 340-350", 64],
      ["article", "Judicial Response to Right to Information in India", "Delhi Law Review", "1999", "Vol XXI, pp 70-82", 65],
      ["article", "International Contracts: Choice of Law and Choice of Forum Clauses in India", "SBRRM Journal of Law", "1999", "Vol 6, pp 5-15", 66],
      ["article", "Foreign Investment Protection in India", "SBRRM Journal of Law", "1998", "Vol 5 (1), pp 36-69", 67],
      ["article", "Right to Privacy: A Comparative Case Law Study", "Law from All Horizons", "1998", "", 68],
      ["article", "Trans-frontier Environmental Protection: New Challenges", "Law and Social Problems", "1998", "Vol 5, pp 71-87", 69],
      ["article", "Development of Right to Privacy as a Constitutional Right in India", "Academy Law Review", "1997", "Vol XXI (1 & 2), pp 195-207", 70],
      ["article", "Sustainable Development of Natural Resources", "SBRRM Journal of Law", "1997", "Vol 3, pp 12-38", 71],
      ["article", "Right to Development versus Right to Environment", "Environmental Law", "1996", "pp 153-161", 72],
      ["article", "Defining Pollution : A Perception in International Law", "Year Book of Legal Studies", "1985", "Vol 19-20, pp 76-86", 73]
    ];
    for (const pub of daPubs) {
      try {
        await pool.query("INSERT INTO faculty_publications (faculty_id, type, title, journal_book_name, year, details, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)", [daId, ...pub]);
      } catch (e) {
        console.error("Pub Error:", pub);
        throw e;
      }
    }

    const daConf = [
      ["South Asian Debating Competition, Colombo, SRILANKA", "Equity, Democracy and Human Rights", "1992", "international", "speaker", 1],
      ["Hague Academy of International Law THE HAGUE", "Summer Course of the Hague Academy of International Law", "1993", "international", "speaker", 2],
      ["Societe de Legislation Comparee, Paris", "Law Relating to Privacy in India", "1997", "international", "speaker", 3],
      ["International Conference on International Law in The New Millennium : ISIL New Delhi", "Development of Municipal Law Through International Law", "2001", "international", "speaker", 4],
      ["Second International Law Conference : ISIL New Delhi", "Sustainable Development: The Role of Civil Society", "2004", "international", "speaker", 5],
      ["International Conference on Bio-Terrorism and Public Safety, Chennai", "Bio-terrorism and Legal Frame Work", "2006", "international", "speaker", 6],
      ["International Conference on Law and Natural Resources Management", "Public Participation In The Management of Natural Resource", "2007", "international", "speaker", 7],
      ["UGC International Seminar on Public Affairs and Governance", "Good Governance and Public Participation", "2009", "international", "speaker", 8],
      ["Advanced IHL South Asia Academics Training : ICRC", "International Humanitarian Law and Human Rights", "2010", "international", "speaker", 9],
      ["Democracy and Human Rights in South Asia Organized", "University of Madras", "2011", "international", "speaker", 10],
      ["Waste Management: Legal Perspective", "University of Northampton & University of Madras", "2012", "international", "speaker", 11],
      ["Biodiversity and Sustainable Energy Development", "Hyderabad", "2012", "international", "speaker", 12],
      ["International Interdisciplinary Seminar on Access to Justice", "University of Kerala", "2016", "international", "speaker", 13],
      ["Climate Change Resilience and Disasters", "TNDALU Chennai", "2017", "international", "speaker", 14],
      ["5th Advanced International Humanitarian Law South Asian Academics Training", "Katmandu Nepal", "2017", "international", "speaker", 15],
      ["Child Trafficking Session", "Saveetha School of Law", "2018", "international", "participant", 16],
      ["Ethiraj College for Women - Social Equity Catalyst", "Legal Frame Work: The Corner Stone of Social Equity", "2019", "international", "speaker", 17],
      ["Trans-border Issues of Human Rights", "Central University of Kerala", "2019", "international", "participant", 18],
      ["North-South Imbalances: Global Perspectives", "Osmania University, Hyderabad", "2020", "international", "speaker", 19],
      ["9th Annual / 5th International Science Fiction Conference", "Bangalore University", "2020", "international", "speaker", 20],
      ["International Humanitarian Law and Future Warfare", "ILS Law College, Pune", "2022", "international", "participant", 21],
      
      // Select sample 15 significant national conferences to represent the massive scope of 125 without overloading rows excessively
      ["Centre- State Financial Relationship with Reference to Public Enterprises", "The Tamil Nadu Academy of Political Science", "1989", "national", "speaker", 22],
      ["All India Law Congress", "University of Delhi Faculty of Law", "1999", "national", "speaker", 23],
      ["National Seminar on Environmental Law", "Dr.Ambedkar Law College Chennai", "1999", "national", "speaker", 24],
      ["Seminar on Personal Laws", "Indian Law Institute, New Delhi", "2002", "national", "speaker", 25],
      ["Seminar on IPR law and Policy", "Dr.B.R. Ambedkar College of Law", "2005", "national", "speaker", 26],
      ["Urban Sustainability Workshop", "University of Madras", "2010", "national", "speaker", 27],
      ["Seminar on Realization Socio Economic Rights", "University of Kerala", "2011", "national", "speaker", 28],
      ["Media Trial V Fair Trial", "University of Madras", "2013", "national", "speaker", 29],
      ["International Trade Law an Over view", "TNDALU", "2014", "national", "speaker", 30],
      ["New Dimensions on IPR", "VIT school of Law", "2016", "national", "participant", 31],
      ["Constitutional Rights and social Justice", "Government law college, Thrissur", "2016", "national", "speaker", 32],
      ["Geo-informatics for rural health and environment sustainability", "University of Madras", "2017", "national", "speaker", 33],
      ["FDP Majoritarianism and Judicial Intervention", "Joseph College of Law, Bengaluru", "2023", "national", "speaker", 34],
      ["RGNUL Law Practicum Series on Conflict of Law", "RGNUL Patiala", "2023", "national", "speaker", 35],
      ["Social and Economic Legislations in India", "KLEF College of Law, AP", "2023", "national", "speaker", 36]
    ];
    for (const c of daConf) {
      try {
        await pool.query("INSERT INTO faculty_conferences (faculty_id, title, details, date, type, role, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)", [daId, ...c]);
      } catch (e) {
        console.error("Conf Error:", c);
        throw e;
      }
    }
    
    // 2. Prof. (Dr.) A. Raghunadha Reddy
    console.log("Seeding Prof. (Dr.) A. Raghunadha Reddy...");
    await pool.query("DELETE FROM faculties WHERE slug = ?", ["a-raghunadha-reddy"]);
    await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ["Prof. (Dr.) A. Raghunadha Reddy", "a-raghunadha-reddy", "Visiting Faculty", "https://dsnlu.ac.in/storage/2023/12/Prof-A-Raghunadha-Reddy.png", "", "", "", "Visiting Professor", "", "Visiting Faculty Profile", "visiting"]
    );

    // 3. Prof. (Dr.) Reddivari Revathi
    console.log("Seeding Prof. (Dr.) Reddivari Revathi...");
    await pool.query("DELETE FROM faculties WHERE slug = ?", ["reddivari-revathi"]);
    await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ["Prof. (Dr.) Reddivari Revathi", "reddivari-revathi", "Visiting Faculty", "https://dsnlu.ac.in/storage/2023/12/Prof-Reddivari-Revathi-1-1.png", "", "", "", "Visiting Professor", "", "Visiting Faculty Profile", "visiting"]
    );
    
    // 4. Prof. (Dr.) Balraj Chauhan
    console.log("Seeding Prof. (Dr.) Balraj Chauhan...");
    await pool.query("DELETE FROM faculties WHERE slug = ?", ["balraj-chauhan"]);
    await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ["Prof. (Dr.) Balraj Chauhan", "balraj-chauhan", "Visiting Faculty", "https://dsnlu.ac.in/storage/2023/04/Prof.-Balraj-Chauhan.jpg", "", "", "", "Visiting Professor", "", "Visiting Faculty Profile", "visiting"]
    );

    // 5. Prof. (Dr.) K.I.Vibhute
    console.log("Seeding Prof. (Dr.) K.I.Vibhute...");
    await pool.query("DELETE FROM faculties WHERE slug = ?", ["ki-vibhute"]);
    await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ["Prof. (Dr.) K.I.Vibhute", "ki-vibhute", "Visiting Faculty", "https://dsnlu.ac.in/storage/2023/04/Prof.-K.I.Vibhute.jpg", "", "", "", "Visiting Professor", "", "Visiting Faculty Profile", "visiting"]
    );

    // 6. Prof. (Dr.) Mehraj Uddin Mir
    console.log("Seeding Prof. (Dr.) Mehraj Uddin Mir...");
    await pool.query("DELETE FROM faculties WHERE slug = ?", ["mehraj-uddin-mir"]);
    await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ["Prof. (Dr.) Mehraj Uddin Mir", "mehraj-uddin-mir", "Visiting Faculty", "https://dsnlu.ac.in/storage/2023/04/Prof.-Mehraj-Uddin-Mir.jpg", "", "", "", "Visiting Professor", "", "Visiting Faculty Profile", "visiting"]
    );

    // 7. Prof. (Dr.) M. Prasada Rao
    console.log("Seeding Prof. (Dr.) M. Prasada Rao...");
    await pool.query("DELETE FROM faculties WHERE slug = ?", ["m-prasada-rao"]);
    await pool.query(
      `INSERT INTO faculties (name, slug, designation, image_url, education_summary, phone, email, present_position, areas_of_interest, bio_html, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ["Prof. (Dr.) M. Prasada Rao", "m-prasada-rao", "Visiting Faculty", "https://dsnlu.ac.in/storage/2023/12/Dr-M-Prasada-Rao.png", "", "", "", "Visiting Professor", "", "Visiting Faculty Profile", "visiting"]
    );


    console.log("Visiting Faculty Seeding Completed!");
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedVisitingFaculty();
