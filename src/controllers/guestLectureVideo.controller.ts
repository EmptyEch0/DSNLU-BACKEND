import { Request, Response } from "express";
import db from "../config/db";

export const createVideo = async (req: Request, res: Response) => {
  const { lecture_id, title, video_url, display_order } = req.body;

  await db.query(
    "INSERT INTO guest_lecture_videos (lecture_id,title,video_url,display_order) VALUES (?,?,?,?)",
    [lecture_id, title, video_url, display_order]
  );

  res.json({ message: "Video added" });
};

export const updateVideo = async (req: Request, res: Response) => {
  const { title, video_url, display_order } = req.body;

  await db.query(
    "UPDATE guest_lecture_videos SET title=?, video_url=?, display_order=? WHERE id=?",
    [title, video_url, display_order, req.params.id]
  );

  res.json({ message: "Video updated" });
};

export const deleteVideo = async (req: Request, res: Response) => {
  await db.query(
    "DELETE FROM guest_lecture_videos WHERE id=?",
    [req.params.id]
  );

  res.json({ message: "Video deleted" });
};
