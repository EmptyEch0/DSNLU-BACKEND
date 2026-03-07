import db from "../config/db";

// GET page content + officers
export const getRTIPage = async () => {
  const [pageRows]: any = await db.query("SELECT * FROM rti_pages LIMIT 1");
  const [officerRows]: any = await db.query("SELECT * FROM rti_officers WHERE is_active = TRUE ORDER BY display_order ASC");
  return { page: pageRows[0] || null, officers: officerRows };
};

// UPDATE page content
export const updateRTIPage = async (id: number, payment_content: string) => {
  await db.query("UPDATE rti_pages SET payment_content = ? WHERE id = ?", [payment_content, id]);
};

// ADD officer
export const addRTIOfficer = async (data: any) => {
  const { role, name, designation, email, phone, address } = data;
  const [orderResult]: any = await db.query("SELECT COALESCE(MAX(display_order),0) + 1 AS next_order FROM rti_officers");
  const nextOrder = orderResult[0].next_order;
  const [result]: any = await db.query(
    "INSERT INTO rti_officers (role, name, designation, email, phone, address, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [role, name, designation, email, phone, address, nextOrder]
  );
  return { id: result.insertId, role, name, designation, email, phone, address, display_order: nextOrder };
};

// UPDATE officer
export const updateRTIOfficer = async (id: number, data: any) => {
  const { role, name, designation, email, phone, address } = data;
  await db.query(
    "UPDATE rti_officers SET role = ?, name = ?, designation = ?, email = ?, phone = ?, address = ? WHERE id = ?",
    [role, name, designation, email, phone, address, id]
  );
  return { id, role, name, designation, email, phone, address };
};

// DELETE officer (soft)
export const deleteRTIOfficer = async (id: number) => {
  await db.query("UPDATE rti_officers SET is_active = FALSE WHERE id = ?", [id]);
};

// REORDER officers
export const reorderRTIOfficers = async (orders: { id: number; order: number }[]) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    for (const item of orders) {
      await connection.query("UPDATE rti_officers SET display_order = ? WHERE id = ?", [item.order, item.id]);
    }
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};
