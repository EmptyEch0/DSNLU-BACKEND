import { Request, Response } from "express";
import db from "../../config/db";

// CREATE MEMBER
export const createMember = async (req: Request, res: Response) => {
  const { centre_slug, role, name } = req.body;

  try {
    const [centre]: any = await db.query(
      `SELECT id FROM centres WHERE slug = ? LIMIT 1`,
      [centre_slug]
    );

    if (!centre.length) {
      return res.status(404).json({ message: "Centre not found" });
    }

    await db.query(
      `INSERT INTO centre_committee_members (centre_id, role, name) VALUES (?, ?, ?)`,
      [centre[0].id, role, name]
    );

    res.json({ message: "Member added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE MEMBER
export const updateMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, name } = req.body;

  try {
    await db.query(
      `UPDATE centre_committee_members SET role = ?, name = ? WHERE id = ?`,
      [role, name, id]
    );

    res.json({ message: "Member updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE MEMBER
export const deleteMember = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await db.query(`DELETE FROM centre_committee_members WHERE id = ?`, [id]);
    res.json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// REORDER MEMBERS
export const reorderMembers = async (req: Request, res: Response) => {
  const { orders } = req.body;

  try {
    for (let item of orders) {
      await db.query(
        `UPDATE centre_committee_members SET display_order = ? WHERE id = ?`,
        [item.order, item.id]
      );
    }

    res.json({ message: "Reordered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
