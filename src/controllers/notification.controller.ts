import { Request, Response } from "express";
import pool from "../config/db";

export const getNotifications = async (_: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM notifications ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("FETCH NOTIFICATIONS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

export const addNotification = async (req: Request, res: Response) => {
  try {
    const { title, link, is_new } = req.body;

    await pool.query(
      "INSERT INTO notifications (title, link, is_new) VALUES (?, ?, ?)",
      [title, link, is_new]
    );

    res.json({ message: "Notification added successfully" });
  } catch (err) {
    console.error("ADD NOTIFICATION ERROR:", err);
    res.status(500).json({ message: "Failed to add notification" });
  }
};

export const updateNotification = async (req: Request, res: Response) => {
  try {
    const { title, link, is_new } = req.body;

    await pool.query(
      "UPDATE notifications SET title=?, link=?, is_new=? WHERE id=?",
      [title, link, is_new, req.params.id]
    );

    res.json({ message: "Notification updated successfully" });
  } catch (err) {
    console.error("UPDATE NOTIFICATION ERROR:", err);
    res.status(500).json({ message: "Failed to update notification" });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    await pool.query(
      "DELETE FROM notifications WHERE id=?",
      [req.params.id]
    );

    res.json({ message: "Notification deleted successfully" });
  } catch (err) {
    console.error("DELETE NOTIFICATION ERROR:", err);
    res.status(500).json({ message: "Failed to delete notification" });
  }
};
