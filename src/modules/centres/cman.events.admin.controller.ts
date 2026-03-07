import { Request, Response } from "express";
import pool from "../../config/db";

const CENTRE_ID = 8;

export const getCmanEvents = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      `SELECT * FROM centre_events
       WHERE centre_id = ? AND is_published = 1
       ORDER BY event_date DESC`,
      [CENTRE_ID]
    );
    res.json(rows);
  } catch (error) {
    console.error("C-MAN getCmanEvents error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  const { title, subtitle, description, event_date, tag, category, display_order, is_published } = req.body;
  try {
    await pool.query(
      `INSERT INTO centre_events
       (centre_id, title, subtitle, description, event_date, tag, category, display_order, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [CENTRE_ID, title, subtitle, description, event_date, tag, category, display_order, is_published ?? 1]
    );
    res.json({ message: "Event created" });
  } catch (error) {
    console.error("C-MAN createEvent error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, subtitle, description, event_date, tag, category, display_order, is_published } = req.body;
  try {
    await pool.query(
      `UPDATE centre_events
       SET title=?, subtitle=?, description=?, event_date=?, tag=?, category=?, display_order=?, is_published=?
       WHERE id=?`,
      [title, subtitle, description, event_date, tag, category, display_order, is_published, id]
    );
    res.json({ message: "Event updated" });
  } catch (error) {
    console.error("C-MAN updateEvent error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    await pool.query("DELETE FROM centre_events WHERE id=?", [req.params.id]);
    res.json({ message: "Event deleted" });
  } catch (error) {
    console.error("C-MAN deleteEvent error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
