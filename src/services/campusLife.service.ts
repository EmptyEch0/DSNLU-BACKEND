import db from "../config/db";

export const getCampusLife = async () => {
  const [rows]: any = await db.query(
    `SELECT id, title, description, image_url, icon_name, display_order
     FROM campus_life
     WHERE is_active = TRUE
     ORDER BY display_order ASC`
  );
  return rows;
};

export const addCampusLife = async (data: any) => {
  const { title, description, image_url, icon_name, display_order } = data;
  const order = display_order || 1;
  const [result]: any = await db.query(
    `INSERT INTO campus_life (title, description, image_url, icon_name, display_order) VALUES (?, ?, ?, ?, ?)`,
    [title, description, image_url, icon_name, order]
  );
  return { id: result.insertId, title, description, image_url, icon_name, display_order: order };
};

export const updateCampusLife = async (id: number, data: any) => {
  const { title, description, image_url, icon_name, display_order } = data;
  await db.query(
    `UPDATE campus_life SET title = ?, description = ?, image_url = ?, icon_name = ?, display_order = ? WHERE id = ?`,
    [title, description, image_url, icon_name, display_order, id]
  );
  return { id, title, description, image_url, icon_name, display_order };
};

export const deleteCampusLife = async (id: number) => {
  await db.query(`UPDATE campus_life SET is_active = FALSE WHERE id = ?`, [id]);
};

export const reorderCampusLife = async (orders: { id: number; order: number }[]) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    for (const item of orders) {
      await connection.query(`UPDATE campus_life SET display_order = ? WHERE id = ?`, [item.order, item.id]);
    }
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};
