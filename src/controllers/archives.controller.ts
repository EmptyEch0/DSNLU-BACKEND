import { Request, Response } from "express";
import db from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ArchiveRow extends RowDataPacket {
  id: number;
  category: string;
  year: string;
  title: string;
  file_url: string;
  published_date: string;
  display_order: number;
  is_active: number;
  created_at: string;
}

// ─── GET /api/archives?category=&year= ───────────────────────────────────────

export const getArchives = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, year } = req.query as { category?: string; year?: string };

    let sql = `
      SELECT id, category, year, title, file_url,
             DATE_FORMAT(published_date, '%Y-%m-%d') AS published_date,
             display_order, is_active, created_at
      FROM   archives
      WHERE  is_active = 1
    `;
    const params: string[] = [];

    if (category) {
      sql += " AND category = ?";
      params.push(category);
    }
    if (year) {
      sql += " AND year = ?";
      params.push(year);
    }

    sql += " ORDER BY display_order ASC, published_date DESC";

    const [rows] = await db.query<ArchiveRow[]>(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("getArchives error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch archives" });
  }
};

// ─── POST /api/archives  (admin) ─────────────────────────────────────────────

export const createArchive = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, year, title, file_url, published_date, display_order = 0 } = req.body;

    if (!category || !year || !title || !file_url || !published_date) {
      res.status(400).json({ success: false, message: "All fields are required" });
      return;
    }

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO archives (category, year, title, file_url, published_date, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [category, year, title, file_url, published_date, display_order]
    );

    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) {
    console.error("createArchive error:", err);
    res.status(500).json({ success: false, message: "Failed to create archive" });
  }
};

// ─── PUT /api/archives/:id  (admin) ──────────────────────────────────────────

export const updateArchive = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { category, year, title, file_url, published_date, display_order, is_active } = req.body;

    const [result] = await db.query<ResultSetHeader>(
      `UPDATE archives
       SET category = ?, year = ?, title = ?, file_url = ?,
           published_date = ?, display_order = ?, is_active = ?
       WHERE id = ?`,
      [category, year, title, file_url, published_date, display_order ?? 0, is_active ?? 1, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: "Archive not found" });
      return;
    }

    res.json({ success: true, message: "Archive updated" });
  } catch (err) {
    console.error("updateArchive error:", err);
    res.status(500).json({ success: false, message: "Failed to update archive" });
  }
};

// ─── DELETE /api/archives/:id  (admin) ───────────────────────────────────────

export const deleteArchive = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM archives WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: "Archive not found" });
      return;
    }

    res.json({ success: true, message: "Archive deleted" });
  } catch (err) {
    console.error("deleteArchive error:", err);
    res.status(500).json({ success: false, message: "Failed to delete archive" });
  }
};
