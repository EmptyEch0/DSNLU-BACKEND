import { Request, Response } from "express";
import db from "../config/db";

// ===============================
// GET FULL FACULTY PROFILE BY SLUG
// ===============================
export const getFacultyProfile = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    // 1. Fetch Basic Info
    const [facultyRows]: any = await db.query(
      "SELECT * FROM faculties WHERE slug = ?",
      [slug]
    );

    if (facultyRows.length === 0) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const faculty = facultyRows[0];

    // 2. Fetch Connected Data in parallel
    const [
      educationRes,
      experienceRes,
      awardsRes,
      publicationsRes,
      conferencesRes,
      researchMetaRes
    ]: any = await Promise.all([
      db.query("SELECT * FROM faculty_education WHERE faculty_id = ?", [faculty.id]),
      db.query("SELECT * FROM faculty_experience WHERE faculty_id = ? ORDER BY display_order ASC", [faculty.id]),
      db.query("SELECT * FROM faculty_awards WHERE faculty_id = ?", [faculty.id]),
      db.query("SELECT * FROM faculty_publications WHERE faculty_id = ? ORDER BY display_order ASC", [faculty.id]),
      db.query("SELECT * FROM faculty_conferences WHERE faculty_id = ? ORDER BY display_order ASC", [faculty.id]),
      db.query("SELECT * FROM faculty_research_meta WHERE faculty_id = ? ORDER BY display_order ASC", [faculty.id])
    ]);

    const education = educationRes[0];
    const experience = experienceRes[0];
    const awards = awardsRes[0];
    const publications = publicationsRes[0];
    const conferences = conferencesRes[0];
    const research_meta = researchMetaRes[0];

    // Construct full profile object
    const profile = {
      ...faculty,
      education,
      experience,
      awards,
      publications,
      conferences,
      research: research_meta
    };

    res.json(profile);
  } catch (error) {
    console.error("FACULTY PROFILE FETCH ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===============================
// GET FACULTY CATEGORIES
// ===============================
export const getCategories = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM faculty_categories WHERE is_active = 1 ORDER BY display_order ASC"
    );
    res.json(rows);
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===============================
// GET FACULTY BY CATEGORY SLUG
// ===============================
export const getFacultyByCategory = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const [category]: any = await db.query(
      "SELECT id FROM faculty_categories WHERE slug = ?",
      [slug]
    );

    if (category.length === 0) return res.json([]);

    const [faculty]: any = await db.query(
      "SELECT * FROM faculties WHERE category_id = ? AND is_active = 1 ORDER BY display_order ASC, name ASC",
      [category[0].id]
    );

    res.json(faculty);
  } catch (error) {
    console.error("GET FACULTY BY CATEGORY ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===============================
// ADMIN: FACULTY CRUD
// ===============================

export const addFaculty = async (req: Request, res: Response) => {
  try {
    const { name, slug, designation, image_url, category_id, display_order } = req.body;
    await db.query(
      "INSERT INTO faculties (name, slug, designation, image_url, category_id, display_order) VALUES (?, ?, ?, ?, ?, ?)",
      [name, slug, designation, image_url, category_id, display_order || 0]
    );
    res.json({ message: "Faculty added successfully" });
  } catch (error) {
    console.error("ADD FACULTY ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateFaculty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, designation, image_url, category_id, display_order, is_active } = req.body;
    await db.query(
      "UPDATE faculties SET name=?, slug=?, designation=?, image_url=?, category_id=?, display_order=?, is_active=? WHERE id=?",
      [name, slug, designation, image_url, category_id, display_order, is_active, id]
    );
    res.json({ message: "Faculty updated successfully" });
  } catch (error) {
    console.error("UPDATE FACULTY ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteFaculty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM faculties WHERE id = ?", [id]);
    res.json({ message: "Faculty deleted successfully" });
  } catch (error) {
    console.error("DELETE FACULTY ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const reorderFaculty = async (req: Request, res: Response) => {
  try {
    const items = req.body; // [{id, display_order}, ...]
    for (const item of items) {
      await db.query("UPDATE faculties SET display_order = ? WHERE id = ?", [item.display_order, item.id]);
    }
    res.json({ message: "Faculty reordered successfully" });
  } catch (error) {
    console.error("REORDER FACULTY ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===============================
// ADMIN: CATEGORY CRUD
// ===============================

export const addCategory = async (req: Request, res: Response) => {
  try {
    const { title, slug, display_order } = req.body;
    await db.query(
      "INSERT INTO faculty_categories (title, slug, display_order) VALUES (?, ?, ?)",
      [title, slug, display_order || 0]
    );
    res.json({ message: "Category added successfully" });
  } catch (error) {
    console.error("ADD CATEGORY ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, slug, display_order, is_active } = req.body;
    await db.query(
      "UPDATE faculty_categories SET title=?, slug=?, display_order=?, is_active=? WHERE id=?",
      [title, slug, display_order, is_active, id]
    );
    res.json({ message: "Category updated successfully" });
  } catch (error) {
    console.error("UPDATE CATEGORY ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM faculty_categories WHERE id = ?", [id]);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
