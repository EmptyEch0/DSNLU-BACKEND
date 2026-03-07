import db from "../config/db";

export const getAcademicCouncilMembers = async () => {
  const [rows]: any = await db.query(
    `SELECT id, serial_no, member_name, designation
     FROM academic_council
     WHERE is_active = TRUE
     ORDER BY display_order ASC`
  );
  return rows;
};

export const addAcademicCouncilMember = async (
  member_name: string,
  designation: string
) => {
  const [orderResult]: any = await db.query(
    `SELECT COALESCE(MAX(display_order),0) + 1 AS next_order FROM academic_council`
  );
  const nextOrder = orderResult[0].next_order;

  const [result]: any = await db.query(
    `INSERT INTO academic_council (serial_no, member_name, designation, display_order)
     VALUES (?, ?, ?, ?)`,
    [nextOrder, member_name, designation, nextOrder]
  );

  return { id: result.insertId, serial_no: nextOrder, member_name, designation };
};

export const updateAcademicCouncilMember = async (
  id: number,
  member_name: string,
  designation: string
) => {
  await db.query(
    `UPDATE academic_council SET member_name = ?, designation = ? WHERE id = ?`,
    [member_name, designation, id]
  );
  return { id, member_name, designation };
};

export const deleteAcademicCouncilMember = async (id: number) => {
  await db.query(
    `UPDATE academic_council SET is_active = FALSE WHERE id = ?`,
    [id]
  );
};

export const reorderAcademicCouncil = async (orders: { id: number; order: number }[]) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    for (const item of orders) {
      await connection.query(
        `UPDATE academic_council SET display_order = ?, serial_no = ? WHERE id = ?`,
        [item.order, item.order, item.id]
      );
    }
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};
