import { Request, Response } from "express";
import pool from "../../config/db";

// LIC Centre ID = 5
const CENTRE_ID = 5;

export const createEvent = async (req: Request, res: Response) => {
  const { title, subtitle, description, category, event_date_label } = req.body;
  try {
    const [result]: any = await pool.query(
      `INSERT INTO centre_events (centre_id, title, subtitle, description, category, event_date_label, display_order)
       VALUES (?, ?, ?, ?, ?, ?, (SELECT COALESCE(MAX(display_order), 0) + 1 FROM centre_events ce WHERE ce.centre_id = ?))`,
      [CENTRE_ID, title, subtitle, description, category, event_date_label, CENTRE_ID]
    );
    res.json({ message: "Event created successfully", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating event" });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, subtitle, description, category, event_date_label } = req.body;
  try {
    await pool.query(
      `UPDATE centre_events 
       SET title = ?, subtitle = ?, description = ?, category = ?, event_date_label = ? 
       WHERE id = ? AND centre_id = ?`,
      [title, subtitle, description, category, event_date_label, id, CENTRE_ID]
    );
    res.json({ message: "Event updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating event" });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM centre_events WHERE id = ? AND centre_id = ?", [id, CENTRE_ID]);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting event" });
  }
};

export const reorderEvents = async (req: Request, res: Response) => {
  const { items } = req.body; // Expecting [{id: 1, display_order: 1}, ...]
  try {
    const queries = items.map((item: any) =>
      pool.query("UPDATE centre_events SET display_order = ? WHERE id = ? AND centre_id = ?", [
        item.display_order,
        item.id,
        CENTRE_ID,
      ])
    );
    await Promise.all(queries);
    res.json({ message: "Events reordered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error reordering events" });
  }
};
