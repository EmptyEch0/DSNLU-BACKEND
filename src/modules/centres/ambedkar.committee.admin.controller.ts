import { Request, Response } from "express";
import pool from "../../config/db";

const CENTRE_ID = 6;

export const getCommittee = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      "SELECT * FROM centre_committees WHERE centre_id = ? ORDER BY display_order ASC",
      [CENTRE_ID]
    );
    res.json(rows);
  } catch (error) {
    console.error("Ambedkar getCommittee error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createMember = async (req: Request, res: Response) => {
  const { role, name, display_order } = req.body;
  try {
    await pool.query(
      "INSERT INTO centre_committees (centre_id, role, name, display_order) VALUES (?, ?, ?, ?)",
      [CENTRE_ID, role, name, display_order]
    );
    res.json({ message: "Member added" });
  } catch (error) {
    console.error("Ambedkar createMember error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, name, display_order } = req.body;
  try {
    await pool.query(
      "UPDATE centre_committees SET role=?, name=?, display_order=? WHERE id=?",
      [role, name, display_order, id]
    );
    res.json({ message: "Member updated" });
  } catch (error) {
    console.error("Ambedkar updateMember error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM centre_committees WHERE id=?", [id]);
    res.json({ message: "Member deleted" });
  } catch (error) {
    console.error("Ambedkar deleteMember error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
