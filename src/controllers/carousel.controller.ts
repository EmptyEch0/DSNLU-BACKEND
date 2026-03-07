import { Request, Response } from "express";
import pool from "../config/db";

export const getCarousel = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, image_url, title, subtitle, display_order
       FROM carousel_images
       WHERE is_active = 1
       ORDER BY display_order ASC
       LIMIT 10
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error("CAROUSEL ERROR:", error);
    res.status(500).json({ message: "Failed to fetch carousel" });
  }
};

export const reorderCarousel = async (req: Request, res: Response) => {
  const { items } = req.body;
  try {
    for (const [index, item] of items.entries()) {
      await pool.query(
        "UPDATE carousel_images SET display_order = ? WHERE id = ?",
        [index + 1, (item as any).id]
      );
    }
    res.json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("REORDER ERROR:", error);
    res.status(500).json({ message: "Failed to reorder" });
  }
};

export const addCarousel = async (req: any, res: Response) => {
  const { title, subtitle, display_order } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;

  try {
    await pool.query(
      "INSERT INTO carousel_images (image_url, title, subtitle, display_order) VALUES (?, ?, ?, ?)",
      [image_url, title, subtitle, display_order || 0]
    );
    res.status(201).json({ message: "Carousel item added successfully" });
  } catch (error) {
    console.error("ADD CAROUSEL ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCarousel = async (req: any, res: Response) => {
  const { id } = req.params;
  const { title, subtitle, display_order, is_active } = req.body;
  
  // Use new file if uploaded, otherwise keep old one (handled by frontend usually, but we check here)
  let updateQuery = "UPDATE carousel_images SET title = ?, subtitle = ?, display_order = ?, is_active = ? WHERE id = ?";
  let params = [title, subtitle, display_order, is_active, id];

  if (req.file) {
    const image_url = `/uploads/${req.file.filename}`;
    updateQuery = "UPDATE carousel_images SET image_url = ?, title = ?, subtitle = ?, display_order = ?, is_active = ? WHERE id = ?";
    params = [image_url, title, subtitle, display_order, is_active, id];
  }

  try {
    const [result]: any = await pool.query(updateQuery, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Carousel item not found" });
    }
    res.status(200).json({ message: "Carousel item updated successfully" });
  } catch (error) {
    console.error("UPDATE CAROUSEL ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCarousel = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [result]: any = await pool.query(
      "DELETE FROM carousel_images WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Carousel item not found" });
    }
    res.status(200).json({ message: "Carousel item deleted successfully" });
  } catch (error) {
    console.error("DELETE CAROUSEL ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
