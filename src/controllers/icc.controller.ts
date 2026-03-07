import { Request, Response } from "express";
import db from "../config/db";

// Public: Get ICC Members
export const getICCMembers = async (req: Request, res: Response) => {
  try {
    const [pageResult]: any = await db.query(
      "SELECT * FROM icc_pages WHERE slug='icc-members'"
    );
    const page = pageResult[0];

    if (!page) {
      // Create the page entry if it doesn't exist
      const [insertResult]: any = await db.query(
        "INSERT INTO icc_pages (slug, title, note) VALUES (?, ?, ?)",
        ["icc-members", "ICC Committee Members", "Ensuring a safe, equitable, and empowered university community for all."]
      );
      const [newPage]: any = await db.query("SELECT * FROM icc_pages WHERE id=?", [insertResult.insertId]);
      return res.json({ page: newPage[0], members: [] });
    }

    const [members] = await db.query(
      "SELECT * FROM icc_members WHERE page_id=? ORDER BY member_type, display_order ASC",
      [page.id]
    );

    res.json({ page, members });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: CRUD for Members
export const createICCMember = async (req: Request, res: Response) => {
  try {
    const { page_id, member_type, name, designation, role, display_order } = req.body;

    await db.query(
      `INSERT INTO icc_members 
       (page_id, member_type, name, designation, role, display_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [page_id, member_type, name, designation, role, display_order || 0]
    );

    res.json({ message: "Member added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateICCMember = async (req: Request, res: Response) => {
  try {
    const { member_type, name, designation, role, display_order } = req.body;
    const { id } = req.params;

    await db.query(
      `UPDATE icc_members 
       SET member_type=?, name=?, designation=?, role=?, display_order=? 
       WHERE id=?`,
      [member_type, name, designation, role, display_order || 0, id]
    );

    res.json({ message: "Member updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteICCMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM icc_members WHERE id=?", [id]);
    res.json({ message: "Member deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
