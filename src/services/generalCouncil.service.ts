import db from "../config/db";

// Get all active members
export const getGeneralCouncilMembers = async () => {
  const [rows]: any = await db.query(
    `SELECT 
      id,
      serial_no,
      member_name,
      designation
    FROM general_council
    WHERE is_active = TRUE
    ORDER BY display_order ASC`
  );
  return rows;
};

// Add a new member
export const addGeneralCouncilMember = async (
  member_name: string,
  designation: string
) => {
  const [orderResult]: any = await db.query(
    `SELECT COALESCE(MAX(display_order),0) + 1 AS next_order FROM general_council`
  );
  const nextOrder = orderResult[0].next_order;

  const [result]: any = await db.query(
    `INSERT INTO general_council (serial_no, member_name, designation, display_order)
     VALUES (?, ?, ?, ?)`,
    [nextOrder, member_name, designation, nextOrder]
  );

  return { id: result.insertId, serial_no: nextOrder, member_name, designation };
};

// Update a member
export const updateGeneralCouncilMember = async (
  id: number,
  member_name: string,
  designation: string
) => {
  await db.query(
    `UPDATE general_council
     SET member_name = ?, designation = ?
     WHERE id = ?`,
    [member_name, designation, id]
  );
  return { id, member_name, designation };
};

// Soft delete a member
export const deleteGeneralCouncilMember = async (id: number) => {
  await db.query(
    `UPDATE general_council SET is_active = FALSE WHERE id = ?`,
    [id]
  );
};

// Reorder members
export const reorderGeneralCouncil = async (orders: { id: number; order: number }[]) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    for (const item of orders) {
      await connection.query(
        `UPDATE general_council SET display_order = ?, serial_no = ? WHERE id = ?`,
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
