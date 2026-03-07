import { Request, Response } from "express";
import db from "../../config/db";

// CREATE YEAR
export const createYear = async (req: Request, res: Response) => {
  const { centre_id, year_label } = req.body;

  try {
    await db.query(
      `INSERT INTO centre_research_years (centre_id, year_label) VALUES (?, ?)`,
      [centre_id, year_label]
    );

    res.json({ message: "Year created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE YEAR
export const updateYear = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { year_label } = req.body;

  try {
    await db.query(
      `UPDATE centre_research_years SET year_label = ? WHERE id = ?`,
      [year_label, id]
    );

    res.json({ message: "Year updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE YEAR
export const deleteYear = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await db.query(`DELETE FROM centre_research_years WHERE id = ?`, [id]);
    res.json({ message: "Year deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// REORDER YEARS
export const reorderYears = async (req: Request, res: Response) => {
  const { orders } = req.body;

  try {
    for (let item of orders) {
      await db.query(
        `UPDATE centre_research_years SET display_order = ? WHERE id = ?`,
        [item.order, item.id]
      );
    }

    res.json({ message: "Years reordered" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// CREATE EVENT
export const createEvent = async (req: Request, res: Response) => {
  const { year_id, event_text } = req.body;

  try {
    await db.query(
      `INSERT INTO centre_research_events (year_id, event_text) VALUES (?, ?)`,
      [year_id, event_text]
    );

    res.json({ message: "Event created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE EVENT
export const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { event_text } = req.body;

  try {
    await db.query(
      `UPDATE centre_research_events SET event_text = ? WHERE id = ?`,
      [event_text, id]
    );

    res.json({ message: "Event updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE EVENT
export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await db.query(`DELETE FROM centre_research_events WHERE id = ?`, [id]);
    res.json({ message: "Event deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// REORDER EVENTS
export const reorderEvents = async (req: Request, res: Response) => {
  const { orders } = req.body;

  try {
    for (let item of orders) {
      await db.query(
        `UPDATE centre_research_events SET display_order = ? WHERE id = ?`,
        [item.order, item.id]
      );
    }

    res.json({ message: "Events reordered" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
