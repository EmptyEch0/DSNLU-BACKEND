import { Request, Response } from "express";
import db from "../config/db";

// GET all programmes with batches (no students - for tab/batch selection)
export const getProgrammes = async (_req: Request, res: Response) => {
  try {
    const [programmes]: any = await db.query(
      `SELECT * FROM cv_programmes WHERE is_active=1 ORDER BY display_order ASC`
    );

    const result = [];
    for (const prog of programmes) {
      const [batches]: any = await db.query(
        `SELECT * FROM cv_batches WHERE programme_id=? AND is_active=1 ORDER BY display_order ASC`,
        [prog.id]
      );
      result.push({
        id: prog.id,
        programme_code: prog.programme_code,
        label: prog.label,
        short_label: prog.short_label,
        batches: batches.map((b: any) => ({
          id: b.id,
          year: b.batch_year,
          student_count: 0,
        })),
      });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch programmes" });
  }
};

// GET students for a specific batch
export const getBatchStudents = async (req: Request, res: Response) => {
  const { batchId } = req.params;
  try {
    const [students]: any = await db.query(
      `SELECT * FROM cv_students WHERE batch_id=? ORDER BY student_name ASC`,
      [batchId]
    );
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

// ADMIN: Add a new programme
export const createProgramme = async (req: Request, res: Response) => {
  const { programme_code, label, short_label, display_order } = req.body;
  try {
    const [result]: any = await db.query(
      `INSERT INTO cv_programmes (programme_code, label, short_label, display_order) VALUES (?,?,?,?)`,
      [programme_code, label, short_label, display_order || 0]
    );
    res.json({ id: result.insertId, message: "Programme created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create programme" });
  }
};

// ADMIN: Add a new batch to a programme
export const createBatch = async (req: Request, res: Response) => {
  const { programme_id, batch_year, display_order } = req.body;
  try {
    const [result]: any = await db.query(
      `INSERT INTO cv_batches (programme_id, batch_year, display_order) VALUES (?,?,?)`,
      [programme_id, batch_year, display_order || 0]
    );
    res.json({ id: result.insertId, message: "Batch created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create batch" });
  }
};

// ADMIN: Delete a batch (cascades to students)
export const deleteBatch = async (req: Request, res: Response) => {
  try {
    await db.query(`DELETE FROM cv_batches WHERE id=?`, [req.params.id]);
    res.json({ message: "Batch deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete batch" });
  }
};

// ADMIN: Add a student to a batch
export const createStudent = async (req: Request, res: Response) => {
  const { batch_id, student_name } = req.body;
  try {
    const [countResult]: any = await db.query(
      `SELECT COUNT(*) as cnt FROM cv_students WHERE batch_id=?`,
      [batch_id]
    );
    const display_order = countResult[0].cnt + 1;
    const [result]: any = await db.query(
      `INSERT INTO cv_students (batch_id, student_name, display_order) VALUES (?,?,?)`,
      [batch_id, student_name, display_order]
    );
    res.json({ id: result.insertId, message: "Student added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add student" });
  }
};

// ADMIN: Delete a student
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    await db.query(`DELETE FROM cv_students WHERE id=?`, [req.params.id]);
    res.json({ message: "Student deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete student" });
  }
};

// ADMIN: Bulk import students (paste list)
export const bulkImportStudents = async (req: Request, res: Response) => {
  const { batch_id, names } = req.body; // names: string[]
  try {
    await db.query(`DELETE FROM cv_students WHERE batch_id=?`, [batch_id]);
    for (let i = 0; i < names.length; i++) {
      if (names[i].trim()) {
        await db.query(
          `INSERT INTO cv_students (batch_id, student_name, display_order) VALUES (?,?,?)`,
          [batch_id, names[i].trim(), i + 1]
        );
      }
    }
    res.json({ message: `${names.length} students imported` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to import students" });
  }
};
