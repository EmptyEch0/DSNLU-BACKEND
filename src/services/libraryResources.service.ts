import db from "../config/db";

/* ─── E-Books ─── */
export const getEBooks = async () => {
  const [rows] = await db.query(
    "SELECT * FROM library_ebooks WHERE is_active = 1 ORDER BY display_order ASC"
  );
  return rows;
};

export const addEBook = async (data: any) => {
  const [rows]: any = await db.query(
    "SELECT COALESCE(MAX(display_order), 0) + 1 as nextOrder FROM library_ebooks"
  );
  const nextOrder = rows[0].nextOrder;
  await db.query(
    "INSERT INTO library_ebooks (title, description, url, icon_name, display_order) VALUES (?, ?, ?, ?, ?)",
    [data.title, data.description, data.url, data.icon_name || "BookOpen", nextOrder]
  );
};

export const updateEBook = async (id: string, data: any) => {
  await db.query(
    "UPDATE library_ebooks SET title=?, description=?, url=?, icon_name=?, is_active=? WHERE id=?",
    [data.title, data.description, data.url, data.icon_name, data.is_active ?? 1, id]
  );
};

export const deleteEBook = async (id: string) => {
  await db.query("DELETE FROM library_ebooks WHERE id=?", [id]);
};

/* ─── E-Databases ─── */
export const getEDatabases = async () => {
  const [rows] = await db.query(
    "SELECT * FROM library_edatabases WHERE is_active = 1 ORDER BY display_order ASC"
  );
  return rows;
};

export const addEDatabase = async (data: any) => {
  const [rows]: any = await db.query(
    "SELECT COALESCE(MAX(display_order), 0) + 1 as nextOrder FROM library_edatabases"
  );
  const nextOrder = rows[0].nextOrder;
  await db.query(
    "INSERT INTO library_edatabases (title, description, url, display_order) VALUES (?, ?, ?, ?)",
    [data.title, data.description, data.url, nextOrder]
  );
};

export const updateEDatabase = async (id: string, data: any) => {
  await db.query(
    "UPDATE library_edatabases SET title=?, description=?, url=?, is_active=? WHERE id=?",
    [data.title, data.description, data.url, data.is_active ?? 1, id]
  );
};

export const deleteEDatabase = async (id: string) => {
  await db.query("DELETE FROM library_edatabases WHERE id=?", [id]);
};

/* ─── E-Journals ─── */
export const getEJournals = async () => {
  const [rows] = await db.query(
    "SELECT * FROM library_ejournals WHERE is_active = 1 ORDER BY display_order ASC"
  );
  return rows;
};

export const addEJournal = async (data: any) => {
  const [rows]: any = await db.query(
    "SELECT COALESCE(MAX(display_order), 0) + 1 as nextOrder FROM library_ejournals"
  );
  const nextOrder = rows[0].nextOrder;
  await db.query(
    "INSERT INTO library_ejournals (title, description, url, image_url, display_order) VALUES (?, ?, ?, ?, ?)",
    [data.title, data.description, data.url, data.image_url, nextOrder]
  );
};

export const updateEJournal = async (id: string, data: any) => {
  await db.query(
    "UPDATE library_ejournals SET title=?, description=?, url=?, image_url=?, is_active=? WHERE id=?",
    [data.title, data.description, data.url, data.image_url, data.is_active ?? 1, id]
  );
};

export const deleteEJournal = async (id: string) => {
  await db.query("DELETE FROM library_ejournals WHERE id=?", [id]);
};
