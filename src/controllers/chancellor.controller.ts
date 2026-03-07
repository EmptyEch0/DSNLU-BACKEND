import { Request, Response } from "express";
import db from "../config/db";

// Get current chancellor
export const getCurrentChancellor = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM chancellors WHERE is_current = TRUE LIMIT 1"
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No current chancellor found",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });

  } catch (error) {
    console.error("Chancellor Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get all chancellors (history)
export const getAllChancellors = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM chancellors ORDER BY start_date ASC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update chancellor
export const updateChancellor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const formatDate = (date: string | null) => {
      if (!date) return null;
      return new Date(date).toISOString().split("T")[0];
    };

    const formattedStartDate = formatDate(data.start_date);
    const formattedEndDate = formatDate(data.end_date);

    // If making this one current, unset others
    if (data.is_current === 1) {
      await db.query(
        "UPDATE chancellors SET is_current = 0 WHERE id != ?",
        [id]
      );
    }

    await db.query(
      `UPDATE chancellors SET
        name=?,
        title_tag=?,
        designation=?,
        university_designation=?,
        biography=?,
        image_url=?,
        start_date=?,
        end_date=?,
        is_current=?
       WHERE id=?`,
      [
        data.name || "",
        data.title_tag || "",
        data.designation || "",
        data.university_designation || "",
        data.biography || "",
        data.image_url || "",
        formattedStartDate,
        formattedEndDate,
        data.is_current ?? 0,
        id
      ]
    );

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};
