import { Request, Response } from "express";
import db from "../config/db";

// ===============================
// GET ALL EXAM RESULTS
// ===============================
export const getAllResults = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM exam_results WHERE is_active = 1 ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("GET ALL EXAM RESULTS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===============================
// GET EXAM RESULT BY SLUG
// ===============================
export const getResultBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const [results]: any = await db.query(
      "SELECT * FROM exam_results WHERE slug = ?",
      [slug]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "Exam result not found" });
    }

    const result = results[0];

    // If type is internal, fetch associated files
    if (result.type === "internal") {
      const [files]: any = await db.query(
        "SELECT * FROM exam_result_files WHERE result_id = ? ORDER BY display_order ASC",
        [result.id]
      );
      result.files = files;
    }

    res.json(result);
  } catch (error) {
    console.error("GET EXAM RESULT BY SLUG ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===============================
// ADMIN: ADD EXAM RESULT
// ===============================
export const addExamResult = async (req: Request, res: Response) => {
  try {
    const { title, slug, result_date, type, link, files } = req.body;
    
    const [insertRes]: any = await db.query(
      "INSERT INTO exam_results (title, slug, result_date, type, link) VALUES (?, ?, ?, ?, ?)",
      [title, slug, result_date, type, link || null]
    );

    const resultId = insertRes.insertId;

    if (type === "internal" && files && files.length > 0) {
      for (const [index, file] of files.entries()) {
        await db.query(
          "INSERT INTO exam_result_files (result_id, label, file_url, display_order) VALUES (?, ?, ?, ?)",
          [resultId, file.label, file.file_url, index + 1]
        );
      }
    }

    res.json({ message: "Exam result added successfully", id: resultId });
  } catch (error) {
    console.error("ADD EXAM RESULT ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===============================
// ADMIN: UPDATE EXAM RESULT
// ===============================
export const updateExamResult = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, slug, result_date, type, link, is_active } = req.body;

    await db.query(
      "UPDATE exam_results SET title=?, slug=?, result_date=?, type=?, link=?, is_active=? WHERE id=?",
      [title, slug, result_date, type, link || null, is_active, id]
    );

    res.json({ message: "Exam result updated successfully" });
  } catch (error) {
    console.error("UPDATE EXAM RESULT ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===============================
// ADMIN: DELETE EXAM RESULT
// ===============================
export const deleteExamResult = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM exam_results WHERE id = ?", [id]);
    res.json({ message: "Exam result deleted successfully" });
  } catch (error) {
    console.error("DELETE EXAM RESULT ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===============================
// ADMIN: INTERNAL FILE CRUD
// ===============================

export const addResultFile = async (req: Request, res: Response) => {
  try {
    const { result_id, label, file_url, display_order } = req.body;
    await db.query(
      "INSERT INTO exam_result_files (result_id, label, file_url, display_order) VALUES (?, ?, ?, ?)",
      [result_id, label, file_url, display_order || 0]
    );
    res.json({ message: "File added successfully" });
  } catch (error) {
    console.error("ADD EXAM FILE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateResultFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { label, file_url, display_order } = req.body;
    await db.query(
      "UPDATE exam_result_files SET label=?, file_url=?, display_order=? WHERE id=?",
      [label, file_url, display_order, id]
    );
    res.json({ message: "File updated successfully" });
  } catch (error) {
    console.error("UPDATE EXAM FILE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteResultFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM exam_result_files WHERE id = ?", [id]);
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("DELETE EXAM FILE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
