import pool from "../config/db";

/* ========= FETCH ========= */

export const getSections = async () => {
  const [sections]: any = await pool.query(
    "SELECT * FROM library_sections ORDER BY display_order ASC"
  );

  for (let section of sections) {
    const [items]: any = await pool.query(
      "SELECT * FROM library_section_items WHERE section_id=? ORDER BY display_order ASC",
      [section.id]
    );
    section.items = items;
  }

  return sections;
};

/* ========= SECTION CRUD ========= */

export const addSection = async (title: string) => {
  const [orderRes]: any = await pool.query(
    "SELECT COALESCE(MAX(display_order),0)+1 AS nextOrder FROM library_sections"
  );

  await pool.query(
    "INSERT INTO library_sections (title, section_key, display_order) VALUES (?,?,?)",
    [title, title.toLowerCase().replace(/\s/g, "_"), orderRes[0].nextOrder]
  );
};

export const updateSection = async (id: number, title: string) => {
  await pool.query(
    "UPDATE library_sections SET title=? WHERE id=?",
    [title, id]
  );
};

export const deleteSection = async (id: number) => {
  // Items will be deleted via cascade if set up in DB, 
  // but explicitly deleting them for safety or if cascade isn't set.
  await pool.query("DELETE FROM library_section_items WHERE section_id=?", [id]);
  await pool.query("DELETE FROM library_sections WHERE id=?", [id]);
};

/* ========= ITEM CRUD ========= */

export const addItem = async (section_id: number, content: string) => {
  const [orderRes]: any = await pool.query(
    "SELECT COALESCE(MAX(display_order),0)+1 AS nextOrder FROM library_section_items WHERE section_id=?",
    [section_id]
  );

  await pool.query(
    "INSERT INTO library_section_items (section_id,content,display_order) VALUES (?,?,?)",
    [section_id, content, orderRes[0].nextOrder]
  );
};

export const updateItem = async (id: number, content: string) => {
  await pool.query(
    "UPDATE library_section_items SET content=? WHERE id=?",
    [content, id]
  );
};

export const deleteItem = async (id: number) => {
  await pool.query("DELETE FROM library_section_items WHERE id=?", [id]);
};
