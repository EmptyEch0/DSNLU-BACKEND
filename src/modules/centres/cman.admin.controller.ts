import { Request, Response } from "express";
import pool from "../../config/db";

const CENTRE_ID = 8;

// --- Committee ---
export const getCmanCommittee = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      "SELECT * FROM centre_committees WHERE centre_id = ? ORDER BY display_order ASC",
      [CENTRE_ID]
    );
    res.json(rows);
  } catch (error) {
    console.error("C-MAN getCmanCommittee error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createCommittee = async (req: Request, res: Response) => {
  const { role, name, display_order } = req.body;
  try {
    await pool.query(
      "INSERT INTO centre_committees (centre_id, role, name, display_order) VALUES (?, ?, ?, ?)",
      [CENTRE_ID, role, name, display_order]
    );
    res.json({ message: "Created" });
  } catch (error) {
    console.error("C-MAN createCommittee error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCommittee = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, name, display_order } = req.body;
  try {
    await pool.query(
      "UPDATE centre_committees SET role=?, name=?, display_order=? WHERE id=?",
      [role, name, display_order, id]
    );
    res.json({ message: "Updated" });
  } catch (error) {
    console.error("C-MAN updateCommittee error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCommittee = async (req: Request, res: Response) => {
  try {
    await pool.query("DELETE FROM centre_committees WHERE id=?", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("C-MAN deleteCommittee error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// --- Students ---
export const getCmanStudents = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      "SELECT * FROM centre_student_members WHERE centre_id = ? ORDER BY year_label, display_order ASC",
      [CENTRE_ID]
    );
    res.json(rows);
  } catch (error) {
    console.error("C-MAN getCmanStudents error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  const { year_label, name, category, display_order } = req.body;
  try {
    await pool.query(
      "INSERT INTO centre_student_members (centre_id, year_label, name, category, display_order) VALUES (?, ?, ?, ?, ?)",
      [CENTRE_ID, year_label, name, category, display_order]
    );
    res.json({ message: "Created" });
  } catch (error) {
    console.error("C-MAN createStudent error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { year_label, name, display_order } = req.body;
  try {
    await pool.query(
      "UPDATE centre_student_members SET year_label=?, name=?, display_order=? WHERE id=?",
      [year_label, name, display_order, id]
    );
    res.json({ message: "Updated" });
  } catch (error) {
    console.error("C-MAN updateStudent error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    await pool.query("DELETE FROM centre_student_members WHERE id=?", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("C-MAN deleteStudent error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
