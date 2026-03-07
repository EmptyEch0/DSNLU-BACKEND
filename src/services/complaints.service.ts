import db from "../config/db";

// ─── Registrar ───
export const getRegistrar = async () => {
  const [rows] = await db.query(
    "SELECT * FROM caste_complaint_registrar ORDER BY display_order ASC"
  );
  return rows;
};

export const addRegistrar = async (data: any) => {
  const [res] = await db.query(
    `INSERT INTO caste_complaint_registrar
    (name, designation, university_name, address, phone, email, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.designation,
      data.university_name,
      data.address,
      data.phone,
      data.email,
      data.display_order || 0,
    ]
  );
  return res;
};

export const updateRegistrar = async (id: string, data: any) => {
  await db.query(
    `UPDATE caste_complaint_registrar
     SET name=?, designation=?, university_name=?, address=?, phone=?, email=?
     WHERE id=?`,
    [
      data.name,
      data.designation,
      data.university_name,
      data.address,
      data.phone,
      data.email,
      id,
    ]
  );
};

export const deleteRegistrar = async (id: string) => {
  await db.query("DELETE FROM caste_complaint_registrar WHERE id=?", [id]);
};

// ─── Members ───
export const getMembers = async () => {
  const [rows] = await db.query(
    "SELECT * FROM caste_complaint_members ORDER BY display_order ASC"
  );
  return rows;
};

export const addMember = async (data: any) => {
  await db.query(
    `INSERT INTO caste_complaint_members (name, role, display_order)
     VALUES (?, ?, ?)`,
    [data.name, data.role, data.display_order || 0]
  );
};

export const updateMember = async (id: string, data: any) => {
  await db.query(
    `UPDATE caste_complaint_members
     SET name=?, role=?
     WHERE id=?`,
    [data.name, data.role, id]
  );
};

export const deleteMember = async (id: string) => {
  await db.query("DELETE FROM caste_complaint_members WHERE id=?", [id]);
};

// ─── Complaint Submissions ───
export const submitComplaint = async (data: any) => {
  const [result] = await db.query(
    `INSERT INTO caste_complaints_submissions
    (full_name, category, email, mobile, subject, description, document_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.full_name,
      data.category,
      data.email,
      data.mobile,
      data.subject,
      data.description,
      data.document_url,
    ]
  );
  return result;
};

export const getSubmissions = async () => {
  const [rows] = await db.query(
    "SELECT * FROM caste_complaints_submissions ORDER BY created_at DESC"
  );
  return rows;
};

export const deleteSubmission = async (id: string) => {
  await db.query(
    "DELETE FROM caste_complaints_submissions WHERE id=?",
    [id]
  );
};

// ─── UGC ───
export const getUGC = async () => {
  const [rows] = await db.query(
    "SELECT * FROM ugc_grievance LIMIT 1"
  );
  return (rows as any)[0];
};

export const addUGC = async (data: any) => {
  await db.query(
    `INSERT INTO ugc_grievance
    (ombudsperson_name, university_name, address, phone, email)
    VALUES (?, ?, ?, ?, ?)`,
    [
      data.ombudsperson_name,
      data.university_name,
      data.address,
      data.phone,
      data.email,
    ]
  );
};

export const updateUGC = async (id: string, data: any) => {
  await db.query(
    `UPDATE ugc_grievance
     SET ombudsperson_name=?, university_name=?, address=?, phone=?, email=?
     WHERE id=?`,
    [
      data.ombudsperson_name,
      data.university_name,
      data.address,
      data.phone,
      data.email,
      id,
    ]
  );
};

export const deleteUGC = async (id: string) => {
  await db.query("DELETE FROM ugc_grievance WHERE id=?", [id]);
};
