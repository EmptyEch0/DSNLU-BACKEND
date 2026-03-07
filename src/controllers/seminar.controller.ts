import { Request, Response } from "express";
import db from "../config/db";

export const getSeminars = async (req: Request, res: Response) => {
  try {
    const [years] = await db.query(
      `SELECT * FROM seminar_years ORDER BY display_order ASC`
    );

    const structured = [];

    for (const year of years as any[]) {
      const [seminars] = await db.query(
        `SELECT * FROM seminars WHERE year_id = ? ORDER BY display_order ASC`,
        [year.id]
      );

      const seminarList = [];

      for (const seminar of seminars as any[]) {
        const [days] = await db.query(
          `SELECT * FROM seminar_days WHERE seminar_id = ? ORDER BY display_order ASC`,
          [seminar.id]
        );

        const [images] = await db.query(
          `SELECT * FROM seminar_images WHERE seminar_id = ? AND day_id IS NULL ORDER BY display_order ASC`,
          [seminar.id]
        );

        const [subjects] = await db.query(
          `SELECT * FROM seminar_subjects WHERE seminar_id = ?`,
          [seminar.id]
        );

        const [guests] = await db.query(
          `SELECT * FROM seminar_guests WHERE seminar_id = ?`,
          [seminar.id]
        );

        const dayList = [];

        for (const day of days as any[]) {
          const [dayImages] = await db.query(
            `SELECT * FROM seminar_images WHERE day_id = ? ORDER BY display_order ASC`,
            [day.id]
          );

          dayList.push({
            ...day,
            images: dayImages
          });
        }

        const chiefGuest = (guests as any[]).find(g => g.guest_type === 'chief')?.guest_name || null;
        const guestsOfHonour = (guests as any[]).filter(g => g.guest_type === 'honour').map(g => g.guest_name);

        seminarList.push({
          ...seminar,
          days: dayList,
          images: (images as any[]).map(i => ({ id: i.id, image_url: i.image_url, display_order: i.display_order })),
          subjects: (subjects as any[]).map(s => ({ id: s.id, subject_name: s.subject_name })),
          guests: {
            chiefGuest: (guests as any[]).find(g => g.guest_type === 'chief'),
            guestsOfHonour: (guests as any[]).filter(g => g.guest_type === 'honour'),
            // Keep legacy support for easier rendering if needed
            chiefGuestName: chiefGuest,
            guestsOfHonourNames: guestsOfHonour
          }
        });
      }

      structured.push({
        ...year,
        seminars: seminarList
      });
    }

    res.json(structured);

  } catch (error) {
    console.error("getSeminars error:", error);
    res.status(500).json({ message: "Failed to fetch seminars" });
  }
};

/* --- ADMIN OPERATIONS --- */

// YEAR
export const createYear = async (req: Request, res: Response) => {
  const { year_label, display_order } = req.body;
  try {
    await db.query(
      "INSERT INTO seminar_years (year_label, display_order) VALUES (?, ?)",
      [year_label, display_order]
    );
    res.json({ message: "Year created" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateYear = async (req: Request, res: Response) => {
  const { year_label, display_order } = req.body;
  try {
    await db.query(
      "UPDATE seminar_years SET year_label=?, display_order=? WHERE id=?",
      [year_label, display_order, req.params.id]
    );
    res.json({ message: "Year updated" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteYear = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM seminar_years WHERE id=?", [req.params.id]);
    res.json({ message: "Year deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// SEMINAR
export const createSeminar = async (req: Request, res: Response) => {
  const { year_id, title, organizer, location, seminar_date, details, display_order } = req.body;
  try {
    await db.query(
      `INSERT INTO seminars 
       (year_id, title, organizer, location, seminar_date, details, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [year_id, title, organizer, location, seminar_date, details, display_order]
    );
    res.json({ message: "Seminar created" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSeminar = async (req: Request, res: Response) => {
  const { title, organizer, location, seminar_date, details, display_order } = req.body;
  try {
    await db.query(
      `UPDATE seminars SET 
       title=?, organizer=?, location=?, seminar_date=?, details=?, display_order=? 
       WHERE id=?`,
      [title, organizer, location, seminar_date, details, display_order, req.params.id]
    );
    res.json({ message: "Seminar updated" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSeminar = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM seminars WHERE id=?", [req.params.id]);
    res.json({ message: "Seminar deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// DAY
export const createDay = async (req: Request, res: Response) => {
  const { seminar_id, day_label, display_order } = req.body;
  try {
    await db.query(
      "INSERT INTO seminar_days (seminar_id, day_label, display_order) VALUES (?, ?, ?)",
      [seminar_id, day_label, display_order]
    );
    res.json({ message: "Day added" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDay = async (req: Request, res: Response) => {
  const { day_label, display_order } = req.body;
  try {
    await db.query(
      "UPDATE seminar_days SET day_label=?, display_order=? WHERE id=?",
      [day_label, display_order, req.params.id]
    );
    res.json({ message: "Day updated" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDay = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM seminar_days WHERE id=?", [req.params.id]);
    res.json({ message: "Day deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// IMAGE
export const addImage = async (req: Request, res: Response) => {
  const { seminar_id, day_id, image_url, display_order } = req.body;
  try {
    await db.query(
      "INSERT INTO seminar_images (seminar_id, day_id, image_url, display_order) VALUES (?, ?, ?, ?)",
      [seminar_id || null, day_id || null, image_url, display_order]
    );
    res.json({ message: "Image added" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM seminar_images WHERE id=?", [req.params.id]);
    res.json({ message: "Image deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// SUBJECT
export const addSubject = async (req: Request, res: Response) => {
  const { seminar_id, subject_name } = req.body;
  try {
    await db.query(
      "INSERT INTO seminar_subjects (seminar_id, subject_name) VALUES (?, ?)",
      [seminar_id, subject_name]
    );
    res.json({ message: "Subject added" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSubject = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM seminar_subjects WHERE id=?", [req.params.id]);
    res.json({ message: "Subject deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GUEST
export const addGuest = async (req: Request, res: Response) => {
  const { seminar_id, guest_name, guest_type } = req.body;
  try {
    await db.query(
      "INSERT INTO seminar_guests (seminar_id, guest_name, guest_type) VALUES (?, ?, ?)",
      [seminar_id, guest_name, guest_type]
    );
    res.json({ message: "Guest added" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteGuest = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM seminar_guests WHERE id=?", [req.params.id]);
    res.json({ message: "Guest deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
