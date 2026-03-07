import { Request, Response } from "express";
import db from "../../config/db";

// CREATE MEMBER
export const createMember = async (req: Request, res: Response) => {
  const { category, role_title, name, semester } = req.body;

  try {
    await db.query(
      `INSERT INTO centre_committee_members
       (centre_id, category, role_title, name, semester)
       VALUES (5, ?, ?, ?, ?)`,
      [category, role_title, name, semester]
    );

    res.json({ message: "Member added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE MEMBER
export const updateMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { category, role_title, name, semester } = req.body;

  try {
    await db.query(
      `UPDATE centre_committee_members
       SET category=?, role_title=?, name=?, semester=?
       WHERE id=?`,
      [category, role_title, name, semester, id]
    );

    res.json({ message: "Updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE MEMBER
export const deleteMember = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await db.query(
      `DELETE FROM centre_committee_members WHERE id=?`,
      [id]
    );

    res.json({ message: "Deleted" });
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
        `UPDATE centre_committee_members
         SET display_order=? WHERE id=?`,
        [item.order, item.id]
      );
    }

    res.json({ message: "Reordered" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
