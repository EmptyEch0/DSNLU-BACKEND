import { Request, Response } from "express";
import db from "../config/db";

// ===============================
// GET STAFF CATEGORIES
// ===============================
export const getCategories = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM staff_categories WHERE is_active = 1 ORDER BY display_order ASC"
    );
    res.json(rows);
  } catch (error) {
    console.error("GET STAFF CATEGORIES ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===============================
// GET STAFF BY CATEGORY SLUG
// ===============================
export const getStaffByCategory = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const [category]: any = await db.query(
      "SELECT id FROM staff_categories WHERE slug = ?",
      [slug]
    );

    if (category.length === 0) return res.json([]);

    const [rows]: any = await db.query(
      "SELECT * FROM staff WHERE category_id = ? AND is_active = 1 ORDER BY display_order ASC, name ASC",
      [category[0].id]
    );

    res.json(rows);
  } catch (error) {
    console.error("GET STAFF BY CATEGORY ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===============================
// ADMIN: STAFF CRUD
// ===============================

export const addStaff = async (req: Request, res: Response) => {
  try {
    const { name, designation, image_url, category_id, display_order } = req.body;
    await db.query(
      "INSERT INTO staff (name, designation, image_url, category_id, display_order) VALUES (?, ?, ?, ?, ?)",
      [name, designation, image_url, category_id, display_order || 0]
    );
    res.json({ message: "Staff member added successfully" });
  } catch (error) {
    console.error("ADD STAFF ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, designation, image_url, category_id, display_order, is_active } = req.body;
    await db.query(
      "UPDATE staff SET name=?, designation=?, image_url=?, category_id=?, display_order=?, is_active=? WHERE id=?",
      [name, designation, image_url, category_id, display_order, is_active, id]
    );
    res.json({ message: "Staff member updated successfully" });
  } catch (error) {
    console.error("UPDATE STAFF ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM staff WHERE id = ?", [id]);
    res.json({ message: "Staff member deleted successfully" });
  } catch (error) {
    console.error("DELETE STAFF ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const reorderStaff = async (req: Request, res: Response) => {
  try {
    const items = req.body; // [{id, display_order}, ...]
    for (const item of items) {
      await db.query("UPDATE staff SET display_order = ? WHERE id = ?", [item.display_order, item.id]);
    }
    res.json({ message: "Staff reordered successfully" });
  } catch (error) {
    console.error("REORDER STAFF ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===============================
// ADMIN: CATEGORY CRUD
// ===============================

export const addCategory = async (req: Request, res: Response) => {
  try {
    const { title, slug, icon, display_order } = req.body;
    await db.query(
      "INSERT INTO staff_categories (title, slug, icon, display_order) VALUES (?, ?, ?, ?)",
      [title, slug, icon || "Briefcase", display_order || 0]
    );
    res.json({ message: "Category added successfully" });
  } catch (error) {
    console.error("ADD STAFF CATEGORY ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, slug, icon, display_order, is_active } = req.body;
    await db.query(
      "UPDATE staff_categories SET title=?, slug=?, icon=?, display_order=?, is_active=? WHERE id=?",
      [title, slug, icon, display_order, is_active, id]
    );
    res.json({ message: "Category updated successfully" });
  } catch (error) {
    console.error("UPDATE STAFF CATEGORY ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM staff_categories WHERE id = ?", [id]);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("DELETE STAFF CATEGORY ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
