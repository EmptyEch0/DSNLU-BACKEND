import { Request, Response } from "express";
import db from "../config/db";


// =========================
// REGULATION CRUD
// =========================

export const createRegulation = async (req: Request, res: Response) => {
  const { program_id, regulation_year, display_order } = req.body;

  try {
    await db.query(
      `INSERT INTO llm_regulations 
       (program_id, regulation_year, display_order)
       VALUES (?, ?, ?)`,
      [program_id || null, regulation_year, display_order || 0]
    );
    res.json({ message: "Regulation created" });
  } catch (error) {
    res.status(500).json({ message: "Error creating regulation" });
  }
};

export const updateRegulation = async (req: Request, res: Response) => {
  const { regulation_year, display_order } = req.body;

  try {
    await db.query(
      `UPDATE llm_regulations
       SET regulation_year=?, display_order=?
       WHERE id=?`,
      [regulation_year, display_order, req.params.id]
    );
    res.json({ message: "Regulation updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating regulation" });
  }
};

export const deleteRegulation = async (req: Request, res: Response) => {
  try {
    await db.query(
      `DELETE FROM llm_regulations WHERE id=?`,
      [req.params.id]
    );
    res.json({ message: "Regulation deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting regulation" });
  }
};



// =========================
// COMPULSORY PAPERS CRUD
// =========================

export const createCompulsoryPaper = async (req: Request, res: Response) => {
  const { regulation_id, paper_code, paper_title, credits, display_order } = req.body;

  try {
    await db.query(
      `INSERT INTO llm_compulsory_papers
       (regulation_id, paper_code, paper_title, credits, display_order)
       VALUES (?, ?, ?, ?, ?)`,
      [regulation_id, paper_code, paper_title, credits, display_order || 0]
    );
    res.json({ message: "Compulsory paper added" });
  } catch (error) {
    res.status(500).json({ message: "Error adding compulsory paper" });
  }
};

export const updateCompulsoryPaper = async (req: Request, res: Response) => {
  const { paper_code, paper_title, credits, display_order } = req.body;

  try {
    await db.query(
      `UPDATE llm_compulsory_papers
       SET paper_code=?, paper_title=?, credits=?, display_order=?
       WHERE id=?`,
      [paper_code, paper_title, credits, display_order, req.params.id]
    );
    res.json({ message: "Compulsory paper updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating compulsory paper" });
  }
};

export const deleteCompulsoryPaper = async (req: Request, res: Response) => {
  try {
    await db.query(
      `DELETE FROM llm_compulsory_papers WHERE id=?`,
      [req.params.id]
    );
    res.json({ message: "Compulsory paper deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting compulsory paper" });
  }
};



// =========================
// DISSERTATION CRUD
// =========================

export const updateDissertation = async (req: Request, res: Response) => {
  const { title, credits, description } = req.body;

  try {
    await db.query(
      `UPDATE llm_dissertation
       SET title=?, credits=?, description=?
       WHERE id=?`,
      [title, credits, description, req.params.id]
    );
    res.json({ message: "Dissertation updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating dissertation" });
  }
};



// =========================
// SPECIALIZATION CRUD
// =========================

export const createSpecialization = async (req: Request, res: Response) => {
  const { regulation_id, specialization_key, specialization_title, display_order } = req.body;

  try {
    await db.query(
      `INSERT INTO llm_specializations
       (regulation_id, specialization_key, specialization_title, display_order)
       VALUES (?, ?, ?, ?)`,
      [regulation_id, specialization_key, specialization_title, display_order || 0]
    );
    res.json({ message: "Specialization created" });
  } catch (error) {
    res.status(500).json({ message: "Error creating specialization" });
  }
};

export const updateSpecialization = async (req: Request, res: Response) => {
  const { specialization_title, display_order } = req.body;

  try {
    await db.query(
      `UPDATE llm_specializations
       SET specialization_title=?, display_order=?
       WHERE id=?`,
      [specialization_title, display_order, req.params.id]
    );
    res.json({ message: "Specialization updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating specialization" });
  }
};

export const deleteSpecialization = async (req: Request, res: Response) => {
  try {
    await db.query(
      `DELETE FROM llm_specializations WHERE id=?`,
      [req.params.id]
    );
    res.json({ message: "Specialization deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting specialization" });
  }
};



// =========================
// SPECIALIZATION PAPERS CRUD
// =========================

export const createSpecializationPaper = async (req: Request, res: Response) => {
  const { specialization_id, paper_code, paper_title, credits, display_order } = req.body;

  try {
    await db.query(
      `INSERT INTO llm_specialization_papers
       (specialization_id, paper_code, paper_title, credits, display_order)
       VALUES (?, ?, ?, ?, ?)`,
      [specialization_id, paper_code, paper_title, credits, display_order || 0]
    );
    res.json({ message: "Specialization paper added" });
  } catch (error) {
    res.status(500).json({ message: "Error adding specialization paper" });
  }
};

export const updateSpecializationPaper = async (req: Request, res: Response) => {
  const { paper_code, paper_title, credits, display_order } = req.body;

  try {
    await db.query(
      `UPDATE llm_specialization_papers
       SET paper_code=?, paper_title=?, credits=?, display_order=?
       WHERE id=?`,
      [paper_code, paper_title, credits, display_order, req.params.id]
    );
    res.json({ message: "Specialization paper updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating specialization paper" });
  }
};

export const deleteSpecializationPaper = async (req: Request, res: Response) => {
  try {
    await db.query(
      `DELETE FROM llm_specialization_papers WHERE id=?`,
      [req.params.id]
    );
    res.json({ message: "Specialization paper deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting specialization paper" });
  }
};
