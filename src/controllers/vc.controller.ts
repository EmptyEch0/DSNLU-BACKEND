import { Request, Response } from "express";
import db from "../config/db"; // your mysql connection

// ===============================
// GET CURRENT VC
// ===============================
export const getCurrentVC = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM vice_chancellors WHERE is_current = TRUE LIMIT 1"
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No current VC found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("VC FETCH ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===============================
// GET FORMER VCs
// ===============================
export const getFormerVCs = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.query(
      "SELECT id, name, start_date, end_date FROM vice_chancellors WHERE is_current = FALSE ORDER BY start_date ASC"
    );

    res.json(rows);
  } catch (error) {
    console.error("FORMER VC ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===============================
// CREATE NEW VC (Admin)
// ===============================
export const createVC = async (req: Request, res: Response) => {
  try {
    const {
      name,
      designation,
      university,
      short_message,
      full_message,
      image_url,
      resume_url,
      start_date
    } = req.body;

    // Make previous VC former
    await db.query("UPDATE vice_chancellors SET is_current = FALSE WHERE is_current = TRUE");

    const [result]: any = await db.query(
      `INSERT INTO vice_chancellors 
      (name, designation, university, short_message, full_message, image_url, resume_url, start_date, is_current)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [name, designation, university, short_message, full_message, image_url, resume_url, start_date]
    );

    res.json({ message: "New VC created successfully", id: result.insertId });
  } catch (error) {
    console.error("CREATE VC ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===============================
// UPDATE CURRENT VC
// ===============================
export const updateCurrentVC = async (req: Request, res: Response) => {
  try {
    const id = req.params.id; // will be undefined for /current route
    const {
      name,
      designation,
      university,
      short_message,
      full_message,
      image_url,
      resume_url
    } = req.body;

    const whereClause = id ? "WHERE id=? AND is_current=1" : "WHERE is_current=TRUE";
    const params = id 
      ? [name, designation, university, short_message, full_message, image_url, resume_url, id]
      : [name, designation, university, short_message, full_message, image_url, resume_url];

    await db.query(
      `UPDATE vice_chancellors 
       SET name=?, designation=?, university=?, short_message=?, full_message=?, image_url=?, resume_url=?
       ${whereClause}`,
      params
    );

    res.json({ message: "VC updated successfully" });
  } catch (error) {
    console.error("UPDATE VC ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===============================
// DELETE VC (optional)
// ===============================
export const deleteVC = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM vice_chancellors WHERE id=?", [id]);

    res.json({ message: "VC deleted successfully" });
  } catch (error) {
    console.error("DELETE VC ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
