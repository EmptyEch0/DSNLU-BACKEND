import db from "../config/db";

/* ─── GET (Public) ─── */
export const getHelpline = async () => {
  const [rows] = await db.query("SELECT * FROM anti_ragging_helpline LIMIT 1");
  return (rows as any)[0];
};

export const getAgency = async () => {
  const [rows] = await db.query("SELECT * FROM anti_ragging_agency LIMIT 1");
  return (rows as any)[0];
};

export const getCommittee = async () => {
  const [rows] = await db.query(
    "SELECT * FROM anti_ragging_committee ORDER BY display_order ASC"
  );
  return rows;
};

export const getDocuments = async () => {
  const [rows] = await db.query(
    "SELECT * FROM anti_ragging_documents ORDER BY display_order ASC"
  );
  return rows;
};

/* ─── Committee CRUD ─── */
export const addCommittee = async (data: any) => {
  await db.query(
    `INSERT INTO anti_ragging_committee
    (type, name, designation, mobile, email, display_order)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.type,
      data.name,
      data.designation,
      data.mobile,
      data.email,
      data.display_order || 0,
    ]
  );
};

export const updateCommittee = async (id: string, data: any) => {
  await db.query(
    `UPDATE anti_ragging_committee
     SET type=?, name=?, designation=?, mobile=?, email=?
     WHERE id=?`,
    [
      data.type,
      data.name,
      data.designation,
      data.mobile,
      data.email,
      id,
    ]
  );
};

export const deleteCommittee = async (id: string) => {
  await db.query("DELETE FROM anti_ragging_committee WHERE id=?", [id]);
};

/* ─── Documents CRUD ─── */
export const addDocument = async (data: any) => {
  await db.query(
    `INSERT INTO anti_ragging_documents (title, url, display_order)
     VALUES (?, ?, ?)`,
    [data.title, data.url, data.display_order || 0]
  );
};

export const deleteDocument = async (id: string) => {
  await db.query("DELETE FROM anti_ragging_documents WHERE id=?", [id]);
};
