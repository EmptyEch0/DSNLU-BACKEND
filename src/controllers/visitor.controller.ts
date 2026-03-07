import { Request, Response } from "express";
import db from "../config/db";

// GET CURRENT VISITOR
export const getCurrentVisitor = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM visitors WHERE is_current = TRUE LIMIT 1"
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No current visitor found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("VISITOR FETCH ERROR:", error);
    res.status(500).json({ message: "Server Error", error: (error as any).message });
  }
};

// GET ALL VISITORS (Former + Present)
export const getAllVisitors = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.query(
      `SELECT id, name, designation, start_date, end_date
       FROM visitors
       ORDER BY start_date ASC`
    );

    res.json(rows);
  } catch (error) {
    console.error("VISITOR TABLE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// CREATE VISITOR
export const createVisitor = async (req: Request, res: Response) => {
    try {
      const {
        name,
        designation,
        university,
        title_tag,
        biography,
        image_url,
        resume_url,
        start_date,
        end_date
      } = req.body;
  
      // Make previous Visitor former
      await db.query("UPDATE visitors SET is_current = FALSE WHERE is_current = TRUE");
  
      const [result]: any = await db.query(
        `INSERT INTO visitors 
        (name, designation, university, title_tag, biography, image_url, resume_url, start_date, end_date, is_current)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
        [name, designation, university, title_tag, biography, image_url, resume_url, start_date, end_date]
      );
  
      res.json({ message: "New Visitor created successfully", id: result.insertId });
    } catch (error) {
      console.error("CREATE VISITOR ERROR:", error);
      res.status(500).json({ message: "Server Error" });
    }
  };

// UPDATE VISITOR
export const updateVisitor = async (req: Request, res: Response) => {
  try {
    const id = req.params.id; // will be undefined for /current route
    const { name, designation, university, title_tag, biography, image_url } = req.body;

    const whereClause = id ? "WHERE id=?" : "WHERE is_current=TRUE";
    const params = id 
      ? [name, designation, university, title_tag, biography, image_url, id]
      : [name, designation, university, title_tag, biography, image_url];

    await db.query(
      `UPDATE visitors SET name=?, designation=?, university=?, title_tag=?, biography=?, image_url=? ${whereClause}`,
      params
    );

    res.json({ message: "Visitor updated successfully" });
  } catch (error) {
    console.error("UPDATE VISITOR ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
