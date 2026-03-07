import db from "../config/db";

export const getAllBooks = async () => {
  const [rows]: any = await db.query(
    "SELECT * FROM publications_books ORDER BY display_order ASC"
  );
  return rows;
};

export const getBookBySlug = async (slug: string) => {
  const [rows]: any = await db.query(
    "SELECT * FROM publications_books WHERE slug = ?",
    [slug]
  );
  return rows[0];
};

export const addBook = async (data: any) => {
  const { title, slug, cover_image_url } = data;
  const [orderResult]: any = await db.query("SELECT COALESCE(MAX(display_order),0) + 1 AS next_order FROM publications_books");
  const nextOrder = orderResult[0].next_order;
  const [result]: any = await db.query(
    "INSERT INTO publications_books (title, slug, cover_image_url, display_order) VALUES (?, ?, ?, ?)",
    [title, slug, cover_image_url, nextOrder]
  );
  return { id: result.insertId, title, slug, cover_image_url, display_order: nextOrder };
};

export const updateBook = async (id: number, data: any) => {
  const { title, slug, cover_image_url } = data;
  await db.query(
    "UPDATE publications_books SET title = ?, slug = ?, cover_image_url = ? WHERE id = ?",
    [title, slug, cover_image_url, id]
  );
  return { id, title, slug, cover_image_url };
};

export const deleteBook = async (id: number) => {
  await db.query("DELETE FROM publications_books WHERE id = ?", [id]);
};

export const reorderBooks = async (orders: { id: number; order: number }[]) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    for (const item of orders) {
      await connection.query("UPDATE publications_books SET display_order = ? WHERE id = ?", [item.order, item.id]);
    }
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};
