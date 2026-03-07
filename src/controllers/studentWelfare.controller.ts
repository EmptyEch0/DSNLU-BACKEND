import { Request, Response } from "express";
import db from "../config/db";

export const getStudentWelfare = async (req: Request, res: Response) => {
  try {
    const [pageResult]: any = await db.query(
      "SELECT * FROM student_welfare_pages WHERE slug='student-welfare-cell'"
    );
    const page = pageResult[0];

    if (!page) return res.status(404).json({ message: "Not found" });

    const [officials]: any = await db.query(
      "SELECT * FROM student_welfare_officials WHERE page_id=? ORDER BY display_order ASC",
      [page.id]
    );

    res.json({
      page,
      officials
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin Operations
export const addOfficial = async (req: Request, res: Response) => {
  try {
    const { page_id, name, designation, sub_role, concern, icon, phone, email, display_order } = req.body;
    await db.query(
      "INSERT INTO student_welfare_officials (page_id, name, designation, sub_role, concern, icon, phone, email, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [page_id, name, designation, sub_role, concern, icon, phone, email, display_order]
    );
    res.json({ message: "Official added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateOfficial = async (req: Request, res: Response) => {
  try {
    const { name, designation, sub_role, concern, icon, phone, email, display_order } = req.body;
    await db.query(
      "UPDATE student_welfare_officials SET name=?, designation=?, sub_role=?, concern=?, icon=?, phone=?, email=?, display_order=? WHERE id=?",
      [name, designation, sub_role, concern, icon, phone, email, display_order, req.params.id]
    );
    res.json({ message: "Official updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteOfficial = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM student_welfare_officials WHERE id=?", [req.params.id]);
    res.json({ message: "Official deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
