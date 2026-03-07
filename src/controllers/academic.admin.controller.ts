import { Request, Response } from "express";
import db from "../config/db";

// Regulations
export const createRegulation = async (req: Request, res: Response) => {
  const { program_id, regulation_year, total_credits, display_order } = req.body;
  try {
    await db.query(
      `INSERT INTO academic_regulations (program_id, regulation_year, total_credits, display_order)
       VALUES (?, ?, ?, ?)`,
      [program_id, regulation_year, total_credits || 0, display_order || 0]
    );
    res.json({ message: "Regulation added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add regulation" });
  }
};

export const deleteRegulation = async (req: Request, res: Response) => {
  try {
    await db.query(`DELETE FROM academic_regulations WHERE id=?`, [req.params.id]);
    res.json({ message: "Regulation deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete regulation" });
  }
};

// Semesters
export const createSemester = async (req: Request, res: Response) => {
  const { regulation_id, semester_title, semester_number, display_order } = req.body;
  try {
    await db.query(
      `INSERT INTO academic_semesters (regulation_id, semester_title, semester_number, display_order)
       VALUES (?, ?, ?, ?)`,
      [regulation_id, semester_title, semester_number, display_order || 0]
    );
    res.json({ message: "Semester added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add semester" });
  }
};

export const deleteSemester = async (req: Request, res: Response) => {
  try {
    await db.query(`DELETE FROM academic_semesters WHERE id=?`, [req.params.id]);
    res.json({ message: "Semester deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete semester" });
  }
};

// Subjects
export const createSubject = async (req: Request, res: Response) => {
  const { semester_id, subject_code, subject_name, credits, display_order } = req.body;
  try {
    await db.query(
      `INSERT INTO academic_subjects (semester_id, subject_code, subject_name, credits, display_order)
       VALUES (?, ?, ?, ?, ?)`,
      [semester_id, subject_code, subject_name, credits || null, display_order || 0]
    );
    res.json({ message: "Subject added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add subject" });
  }
};

export const deleteSubject = async (req: Request, res: Response) => {
  try {
    await db.query(`DELETE FROM academic_subjects WHERE id=?`, [req.params.id]);
    res.json({ message: "Subject deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete subject" });
  }
};
