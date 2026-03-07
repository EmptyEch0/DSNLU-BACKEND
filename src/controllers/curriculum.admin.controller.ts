import db from "../config/db";
import { Request, Response } from "express";

/* --- YEAR CRUD --- */

export const createYear = async (req: Request, res: Response) => {
  try {
    const { year_label, total_credits, display_order } = req.body;
    await db.query(
      `INSERT INTO curriculum_years 
       (year_label, total_credits, display_order) 
       VALUES (?, ?, ?)`,
      [year_label, total_credits, display_order]
    );
    res.json({ message: "Year created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create year" });
  }
};

export const updateYear = async (req: Request, res: Response) => {
  try {
    const { year_label, total_credits, display_order } = req.body;
    await db.query(
      `UPDATE curriculum_years
       SET year_label=?, total_credits=?, display_order=?
       WHERE id=?`,
      [year_label, total_credits, display_order, req.params.id]
    );
    res.json({ message: "Year updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update year" });
  }
};

export const deleteYear = async (req: Request, res: Response) => {
  try {
    await db.query(
      `DELETE FROM curriculum_years WHERE id=?`,
      [req.params.id]
    );
    res.json({ message: "Year deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete year" });
  }
};

/* --- SEMESTER CRUD --- */

export const createSemester = async (req: Request, res: Response) => {
  try {
    const { year_id, title, semester_number, display_order } = req.body;
    await db.query(
      `INSERT INTO curriculum_semesters
       (year_id, title, semester_number, display_order)
       VALUES (?, ?, ?, ?)`,
      [year_id, title, semester_number, display_order]
    );
    res.json({ message: "Semester created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create semester" });
  }
};

export const updateSemester = async (req: Request, res: Response) => {
  try {
    const { title, semester_number, display_order } = req.body;
    await db.query(
      `UPDATE curriculum_semesters
       SET title=?, semester_number=?, display_order=?
       WHERE id=?`,
      [title, semester_number, display_order, req.params.id]
    );
    res.json({ message: "Semester updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update semester" });
  }
};

export const deleteSemester = async (req: Request, res: Response) => {
  try {
    await db.query(
      `DELETE FROM curriculum_semesters WHERE id=?`,
      [req.params.id]
    );
    res.json({ message: "Semester deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete semester" });
  }
};

/* --- SUBJECT CRUD --- */

export const createSubject = async (req: Request, res: Response) => {
  try {
    const { semester_id, subject_code, subject_name, credits, display_order } = req.body;
    await db.query(
      `INSERT INTO curriculum_subjects
       (semester_id, subject_code, subject_name, credits, display_order)
       VALUES (?, ?, ?, ?, ?)`,
      [semester_id, subject_code, subject_name, credits, display_order]
    );
    res.json({ message: "Subject created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create subject" });
  }
};

export const updateSubject = async (req: Request, res: Response) => {
  try {
    const { subject_code, subject_name, credits, display_order } = req.body;
    await db.query(
      `UPDATE curriculum_subjects
       SET subject_code=?, subject_name=?, credits=?, display_order=?
       WHERE id=?`,
      [subject_code, subject_name, credits, display_order, req.params.id]
    );
    res.json({ message: "Subject updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update subject" });
  }
};

export const deleteSubject = async (req: Request, res: Response) => {
  try {
    await db.query(
      `DELETE FROM curriculum_subjects WHERE id=?`,
      [req.params.id]
    );
    res.json({ message: "Subject deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete subject" });
  }
};
