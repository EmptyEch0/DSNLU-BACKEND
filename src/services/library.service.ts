import pool from "../config/db";

// ================= TEAM =================

export const getTeam = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM library_team ORDER BY display_order ASC"
  );
  return rows;
};

export const addTeam = async (data: any) => {
  const { name, role, image_url } = data;

  const [orderRes]: any = await pool.query(
    "SELECT COALESCE(MAX(display_order),0)+1 AS nextOrder FROM library_team"
  );

  await pool.query(
    "INSERT INTO library_team (name, role, image_url, display_order) VALUES (?,?,?,?)",
    [name, role, image_url, orderRes[0].nextOrder]
  );
};

export const updateTeam = async (id: number, data: any) => {
  const { name, role, image_url } = data;
  await pool.query(
    "UPDATE library_team SET name=?, role=?, image_url=? WHERE id=?",
    [name, role, image_url, id]
  );
};

export const deleteTeam = async (id: number) => {
  await pool.query("DELETE FROM library_team WHERE id=?", [id]);
};

// ================= COMMITTEE =================

export const getCommittee = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM library_committee ORDER BY display_order ASC"
  );
  return rows;
};

export const addCommittee = async (data: any) => {
  const { designation, name } = data;

  const [orderRes]: any = await pool.query(
    "SELECT COALESCE(MAX(display_order),0)+1 AS nextOrder FROM library_committee"
  );

  await pool.query(
    "INSERT INTO library_committee (designation, name, display_order) VALUES (?,?,?)",
    [designation, name, orderRes[0].nextOrder]
  );
};

export const updateCommittee = async (id: number, data: any) => {
  const { designation, name } = data;
  await pool.query(
    "UPDATE library_committee SET designation=?, name=? WHERE id=?",
    [designation, name, id]
  );
};

export const deleteCommittee = async (id: number) => {
  await pool.query("DELETE FROM library_committee WHERE id=?", [id]);
};

// ================= TIMINGS =================

export const getTimings = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM library_timings ORDER BY display_order ASC"
  );
  return rows;
};

export const addTiming = async (data: any) => {
  const { category, label, value } = data;

  const [orderRes]: any = await pool.query(
    "SELECT COALESCE(MAX(display_order),0)+1 AS nextOrder FROM library_timings WHERE category=?",
    [category]
  );

  await pool.query(
    "INSERT INTO library_timings (category,label,value,display_order) VALUES (?,?,?,?)",
    [category, label, value, orderRes[0].nextOrder]
  );
};

export const updateTiming = async (id: number, data: any) => {
  const { category, label, value } = data;
  await pool.query(
    "UPDATE library_timings SET category=?, label=?, value=? WHERE id=?",
    [category, label, value, id]
  );
};

export const deleteTiming = async (id: number) => {
  await pool.query("DELETE FROM library_timings WHERE id=?", [id]);
};
