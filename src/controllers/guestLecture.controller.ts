import { Request, Response } from "express";
import db from "../config/db";

export const getGuestLectures = async (req: Request, res: Response) => {
  try {
    const [years]: any = await db.query(
      "SELECT * FROM guest_lecture_years ORDER BY display_order ASC"
    );

    for (let year of years) {
      const [lectures]: any = await db.query(
        "SELECT * FROM guest_lectures WHERE year_id=? ORDER BY display_order ASC",
        [year.id]
      );

      for (let lecture of lectures) {
        const [videos]: any = await db.query(
          "SELECT * FROM guest_lecture_videos WHERE lecture_id=? ORDER BY display_order ASC",
          [lecture.id]
        );

        lecture.videos = videos;
      }

      year.lectures = lectures;
    }

    res.json(years);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createLecture = async (req: Request, res: Response) => {
  const {
    year_id,
    speaker_name,
    designation,
    topic,
    lecture_date,
    description,
    image_url,
    display_order
  } = req.body;

  await db.query(
    `INSERT INTO guest_lectures
     (year_id, speaker_name, designation, topic, lecture_date, description, image_url, display_order)
     VALUES (?,?,?,?,?,?,?,?)`,
    [year_id, speaker_name, designation, topic, lecture_date, description, image_url, display_order]
  );

  res.json({ message: "Lecture created" });
};

export const updateLecture = async (req: Request, res: Response) => {
  const {
    speaker_name,
    designation,
    topic,
    lecture_date,
    description,
    image_url,
    display_order
  } = req.body;

  await db.query(
    `UPDATE guest_lectures SET
     speaker_name=?, designation=?, topic=?, lecture_date=?, description=?, image_url=?, display_order=?
     WHERE id=?`,
    [speaker_name, designation, topic, lecture_date, description, image_url, display_order, req.params.id]
  );

  res.json({ message: "Lecture updated" });
};

export const deleteLecture = async (req: Request, res: Response) => {
  await db.query(
    "DELETE FROM guest_lectures WHERE id=?",
    [req.params.id]
  );

  res.json({ message: "Lecture deleted" });
};

export const reorderLectures = async (req: Request, res: Response) => {
  const { items } = req.body;

  for (let item of items) {
    await db.query(
      "UPDATE guest_lectures SET display_order=? WHERE id=?",
      [item.display_order, item.id]
    );
  }

  res.json({ message: "Lectures reordered" });
};
