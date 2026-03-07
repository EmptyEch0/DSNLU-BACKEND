import db from "../config/db";

export const getPlacementPage = async () => {
  const [page]: any = await db.query(
    "SELECT * FROM placement_pages WHERE slug='placement-internship'"
  );

  if (!page || page.length === 0) {
    throw new Error("Placement page not found");
  }

  const [sections]: any = await db.query(
    "SELECT * FROM placement_sections WHERE page_id=? ORDER BY display_order ASC",
    [page[0].id]
  );

  const [members]: any = await db.query(
    "SELECT * FROM placement_members WHERE page_id=? ORDER BY display_order ASC",
    [page[0].id]
  );

  return {
    page: page[0],
    sections,
    members,
  };
};

export const updatePlacementSection = async (id: number, description: string) => {
  await db.query("UPDATE placement_sections SET description = ? WHERE id = ?", [
    description,
    id,
  ]);
};

export const addPlacementMember = async (member: any) => {
  const { page_id, name, role, email, phone, committee_type } = member;
  const [result]: any = await db.query(
    "INSERT INTO placement_members (page_id, name, role, email, phone, committee_type) VALUES (?, ?, ?, ?, ?, ?)",
    [page_id, name, role, email, phone, committee_type]
  );
  return result.insertId;
};

export const updatePlacementMember = async (id: number, member: any) => {
  const { name, role, email, phone, committee_type } = member;
  await db.query(
    "UPDATE placement_members SET name = ?, role = ?, email = ?, phone = ?, committee_type = ? WHERE id = ?",
    [name, role, email, phone, committee_type, id]
  );
};

export const deletePlacementMember = async (id: number) => {
  await db.query("DELETE FROM placement_members WHERE id = ?", [id]);
};
