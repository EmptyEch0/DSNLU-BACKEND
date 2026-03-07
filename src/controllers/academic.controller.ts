import { Request, Response } from "express";
import db from "../config/db";

export const getProgramCurriculum = async (req: Request, res: Response) => {
  try {
    const [years]: any = await db.query(
      `SELECT * FROM curriculum_years ORDER BY display_order DESC`
    );

    const result = [];

    for (const year of years) {
      const [semesters]: any = await db.query(
        `SELECT * FROM curriculum_semesters
         WHERE year_id = ?
         ORDER BY semester_number ASC`,
        [year.id]
      );

      const semData = [];

      for (const sem of semesters) {
        const [subjects]: any = await db.query(
          `SELECT * FROM curriculum_subjects
           WHERE semester_id = ?
           ORDER BY display_order ASC`,
          [sem.id]
        );

        semData.push({
          id: sem.id,
          title: sem.title,
          subjects: subjects,
        });
      }

      result.push({
        id: year.id,
        year: year.year_label,
        total_credits: year.total_credits,
        semesters: semData,
      });
    }

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch curriculum" });
  }
};