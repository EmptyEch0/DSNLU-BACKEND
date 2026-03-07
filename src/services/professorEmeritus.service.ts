import db from "../config/db";

export const getEmeritusList = async () => {
  const [rows]: any = await db.query(
    `SELECT id, name, title, subtitle, image_url, slug
     FROM professor_emeritus
     WHERE is_active = TRUE
     ORDER BY display_order ASC`
  );
  return rows;
};

export const getEmeritusBySlug = async (slug: string) => {
  const [rows]: any = await db.query(
    `SELECT * FROM professor_emeritus WHERE slug = ? AND is_active = TRUE`,
    [slug]
  );
  return rows[0];
};

export const addEmeritus = async (data: any) => {
  const { name, title, subtitle, image_url, slug, bio_html, display_order } = data;
  const order = display_order || 1;
  const [result]: any = await db.query(
    `INSERT INTO professor_emeritus (name, title, subtitle, image_url, slug, bio_html, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, title, subtitle, image_url, slug, bio_html, order]
  );
  return { id: result.insertId, name, title, subtitle, image_url, slug };
};

export const updateEmeritus = async (id: number, data: any) => {
  const { name, title, subtitle, image_url, slug, bio_html, display_order } = data;
  await db.query(
    `UPDATE professor_emeritus SET name = ?, title = ?, subtitle = ?, image_url = ?, slug = ?, bio_html = ?, display_order = ? WHERE id = ?`,
    [name, title, subtitle, image_url, slug, bio_html, display_order, id]
  );
  return { id, name, title, subtitle, image_url, slug };
};

export const deleteEmeritus = async (id: number) => {
  await db.query(`UPDATE professor_emeritus SET is_active = FALSE WHERE id = ?`, [id]);
};

export const reorderEmeritus = async (orders: { id: number; order: number }[]) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    for (const item of orders) {
      await connection.query(`UPDATE professor_emeritus SET display_order = ? WHERE id = ?`, [item.order, item.id]);
    }
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};
