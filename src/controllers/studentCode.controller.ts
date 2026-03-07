import { Request, Response } from "express";
import db from "../config/db";

export const getStudentCode = async (req: Request, res: Response) => {
  try {
    const [pageResult]: any = await db.query(
      "SELECT * FROM student_code_pages WHERE slug='student-code-of-conduct'"
    );
    const page = pageResult[0];

    if (!page) return res.status(404).json({ message: "Not found" });

    const [sections]: any = await db.query(
      "SELECT * FROM student_code_sections WHERE page_id=? ORDER BY display_order ASC",
      [page.id]
    );

    const [items]: any = await db.query(
      `SELECT i.*, s.section_key 
       FROM student_code_section_items i
       JOIN student_code_sections s ON i.section_id = s.id
       WHERE s.page_id=? 
       ORDER BY i.display_order ASC`,
      [page.id]
    );

    const [steps]: any = await db.query(
      "SELECT * FROM student_code_process_steps WHERE page_id=? ORDER BY step_number ASC",
      [page.id]
    );

    const [penalties]: any = await db.query(
      "SELECT * FROM student_code_penalties WHERE page_id=? ORDER BY display_order ASC",
      [page.id]
    );

    res.json({
      page,
      sections,
      items,
      steps,
      penalties
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin Section Operations
export const updateSection = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    await db.query(
      "UPDATE student_code_sections SET title=?, content=? WHERE id=?",
      [title, content, req.params.id]
    );
    res.json({ message: "Section updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Admin Item Operations
export const addSectionItem = async (req: Request, res: Response) => {
  try {
    const { section_id, title, content, display_order } = req.body;
    await db.query(
      "INSERT INTO student_code_section_items (section_id, title, content, display_order) VALUES (?, ?, ?, ?)",
      [section_id, title, content, display_order]
    );
    res.json({ message: "Item added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateSectionItem = async (req: Request, res: Response) => {
  try {
    const { title, content, display_order } = req.body;
    await db.query(
      "UPDATE student_code_section_items SET title=?, content=?, display_order=? WHERE id=?",
      [title, content, display_order, req.params.id]
    );
    res.json({ message: "Item updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteSectionItem = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM student_code_section_items WHERE id=?", [req.params.id]);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Admin Process Step Operations
export const addProcessStep = async (req: Request, res: Response) => {
  try {
    const { page_id, step_number, title, description } = req.body;
    await db.query(
      "INSERT INTO student_code_process_steps (page_id, step_number, title, description) VALUES (?, ?, ?, ?)",
      [page_id, step_number, title, description]
    );
    res.json({ message: "Step added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateProcessStep = async (req: Request, res: Response) => {
  try {
    const { step_number, title, description } = req.body;
    await db.query(
      "UPDATE student_code_process_steps SET step_number=?, title=?, description=? WHERE id=?",
      [step_number, title, description, req.params.id]
    );
    res.json({ message: "Step updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteProcessStep = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM student_code_process_steps WHERE id=?", [req.params.id]);
    res.json({ message: "Step deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Admin Penalty Operations
export const addPenalty = async (req: Request, res: Response) => {
  try {
    const { page_id, penalty_type, description, display_order } = req.body;
    await db.query(
      "INSERT INTO student_code_penalties (page_id, penalty_type, description, display_order) VALUES (?, ?, ?, ?)",
      [page_id, penalty_type, description, display_order]
    );
    res.json({ message: "Penalty added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updatePenalty = async (req: Request, res: Response) => {
  try {
    const { penalty_type, description, display_order } = req.body;
    await db.query(
      "UPDATE student_code_penalties SET penalty_type=?, description=?, display_order=? WHERE id=?",
      [penalty_type, description, display_order, req.params.id]
    );
    res.json({ message: "Penalty updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deletePenalty = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM student_code_penalties WHERE id=?", [req.params.id]);
    res.json({ message: "Penalty deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
