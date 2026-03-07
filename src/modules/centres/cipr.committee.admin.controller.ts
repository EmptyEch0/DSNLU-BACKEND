import { Request, Response } from "express";
import pool from "../../config/db";

// Center ID for CIPR based on user snippet (or LIC if 5 is LIC)
// User snippet uses 5 for LIC and now 5 for CIPR? 
// I will stick to what the user provides in the snippet for CIPR (5).
const CENTRE_ID = 5;

export const getCommittee = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      "SELECT * FROM centre_committees WHERE centre_id = ? ORDER BY display_order ASC",
      [CENTRE_ID]
    );
    res.json(rows);
  } catch (error) {
    console.error("CIPR getCommittee error:", error);
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
    res.json({ message: "Member created" });
  } catch (error) {
    console.error("CIPR createMember error:", error);
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
    console.error("CIPR updateMember error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM centre_committees WHERE id=?", [id]);
    res.json({ message: "Member deleted" });
  } catch (error) {
    console.error("CIPR deleteMember error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
