import { Request, Response } from "express";
import db from "../config/db";

export const createYear = async (req: Request, res: Response) => {
  const { year_label, display_order } = req.body;

  await db.query(
    "INSERT INTO guest_lecture_years (year_label, display_order) VALUES (?,?)",
    [year_label, display_order]
  );

  res.json({ message: "Year created" });
};

export const updateYear = async (req: Request, res: Response) => {
  const { year_label, display_order } = req.body;

  await db.query(
    "UPDATE guest_lecture_years SET year_label=?, display_order=? WHERE id=?",
    [year_label, display_order, req.params.id]
  );

  res.json({ message: "Year updated" });
};

export const deleteYear = async (req: Request, res: Response) => {
  await db.query(
    "DELETE FROM guest_lecture_years WHERE id=?",
    [req.params.id]
  );

  res.json({ message: "Year deleted" });
};

export const reorderYears = async (req: Request, res: Response) => {
  const { items } = req.body; 
  // items = [{id:1, display_order:1}, ...]

  for (let item of items) {
    await db.query(
      "UPDATE guest_lecture_years SET display_order=? WHERE id=?",
      [item.display_order, item.id]
    );
  }

  res.json({ message: "Years reordered" });
};
