import { Request, Response } from "express";
import db from "../config/db";

// ===============================
// GET ALL VISITING FACULTIES
// ===============================
export const getVisitingFaculties = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.query(
      "SELECT id, name, slug, designation, image_url, present_position, display_order FROM faculties WHERE category = 'visiting' ORDER BY display_order ASC, name ASC"
    );
    res.json(rows);
  } catch (error) {
    console.error("VISITING FACULTIES FETCH ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===============================
// ADD VISITING FACULTY
// ===============================
export const addVisitingFaculty = async (req: Request, res: Response) => {
  try {
    const { name, designation, image_url, present_position, display_order } = req.body;
    
    if (!name || !image_url) {
      return res.status(400).json({ message: "Name and Image URL are required" });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const [result]: any = await db.query(
      `INSERT INTO faculties (name, slug, designation, image_url, present_position, category, display_order)
       VALUES (?, ?, ?, ?, ?, 'visiting', ?)`,
      [name, slug, designation || 'Visiting Faculty', image_url, present_position || 'Visiting Professor', display_order || 0]
    );

    res.status(201).json({ id: result.insertId, message: "Visiting faculty added successfully" });
  } catch (error) {
    console.error("ADD VISITING FACULTY ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===============================
// UPDATE VISITING FACULTY
// ===============================
export const updateVisitingFaculty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, designation, image_url, present_position, display_order } = req.body;

    const slug = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : null;

    let query = "UPDATE faculties SET ";
    const params: any[] = [];

    if (name) { query += "name = ?, slug = ?, "; params.push(name, slug); }
    if (designation !== undefined) { query += "designation = ?, "; params.push(designation); }
    if (image_url !== undefined) { query += "image_url = ?, "; params.push(image_url); }
    if (present_position !== undefined) { query += "present_position = ?, "; params.push(present_position); }
    if (display_order !== undefined) { query += "display_order = ?, "; params.push(display_order); }

    query = query.slice(0, -2); // Remove last comma
    query += " WHERE id = ? AND category = 'visiting'";
    params.push(id);

    const [result]: any = await db.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Visiting faculty not found" });
    }

    res.json({ message: "Visiting faculty updated successfully" });
  } catch (error) {
    console.error("UPDATE VISITING FACULTY ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===============================
// DELETE VISITING FACULTY
// ===============================
export const deleteVisitingFaculty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [result]: any = await db.query("DELETE FROM faculties WHERE id = ? AND category = 'visiting'", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Visiting faculty not found" });
    }

    res.json({ message: "Visiting faculty deleted successfully" });
  } catch (error) {
    console.error("DELETE VISITING FACULTY ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
