import { Request, Response } from "express";
import pool from "../../config/db";

const CENTRE_ID = 5;

export const getBoard = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      "SELECT * FROM centre_boards WHERE centre_id = ? ORDER BY display_order ASC",
      [CENTRE_ID]
    );
    res.json(rows);
  } catch (error) {
    console.error("CIPR getBoard error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createMember = async (req: Request, res: Response) => {
  const { role, name, designation, email, display_order } = req.body;
  try {
    await pool.query(
      `INSERT INTO centre_boards 
      (centre_id, role, name, designation, email, display_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [CENTRE_ID, role, name, designation, email, display_order]
    );
    res.json({ message: "Board member added" });
  } catch (error) {
    console.error("CIPR createMember error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, name, designation, email, display_order } = req.body;
  try {
    await pool.query(
      `UPDATE centre_boards 
       SET role=?, name=?, designation=?, email=?, display_order=? 
       WHERE id=?`,
      [role, name, designation, email, display_order, id]
    );
    res.json({ message: "Board member updated" });
  } catch (error) {
    console.error("CIPR updateMember error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM centre_boards WHERE id=?", [id]);
    res.json({ message: "Board member deleted" });
  } catch (error) {
    console.error("CIPR deleteMember error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
