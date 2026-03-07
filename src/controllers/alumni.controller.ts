import { Request, Response } from "express";
import db from "../config/db";

// Public: Get Alumni Page Data
export const getAlumniPage = async (req: Request, res: Response) => {
  try {
    const [pageResult]: any = await db.query(
      "SELECT * FROM alumni_pages WHERE slug='alumni-committee'"
    );
    let page = pageResult[0];

    if (!page) {
      const [insertResult]: any = await db.query(
        "INSERT INTO alumni_pages (slug, title, about_text, address, email, footer_note) VALUES (?, ?, ?, ?, ?, ?)",
        [
          "alumni-committee", 
          "Alumni Relations Committee", 
          "The Alumni Relations Committee of DSNLU serves as a vital bridge between the University and its alumni network...", 
          "Damodaram Sanjivayya National Law University, NYAYAPRASTHA, Sabbavaram, Visakhapatnam – 531035, Andhra Pradesh, India", 
          "alumni@dsnlu.ac.in", 
          "Connecting generations. Strengthening legacy."
        ]
      );
      const [newPage]: any = await db.query("SELECT * FROM alumni_pages WHERE id=?", [insertResult.insertId]);
      page = newPage[0];
    }

    const [members] = await db.query(
      "SELECT * FROM alumni_members WHERE page_id=? ORDER BY display_order ASC",
      [page.id]
    );

    const [events] = await db.query(
      "SELECT * FROM alumni_events WHERE page_id=? ORDER BY display_order ASC",
      [page.id]
    );

    const [highlights] = await db.query(`
      SELECT h.*, e.id as event_id 
      FROM alumni_event_highlights h
      JOIN alumni_events e ON h.event_id = e.id
      ORDER BY h.display_order ASC
    `);

    const [gallery] = await db.query(
      "SELECT * FROM alumni_gallery WHERE page_id=? ORDER BY display_order ASC",
      [page.id]
    );

    res.json({ page, members, events, highlights, gallery });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin CRUD: Members
export const createAlumniMember = async (req: Request, res: Response) => {
  try {
    const { page_id, member_type, student_year, name, role, display_order } = req.body;
    await db.query(
      "INSERT INTO alumni_members (page_id, member_type, student_year, name, role, display_order) VALUES (?, ?, ?, ?, ?, ?)",
      [page_id, member_type, student_year, name, role, display_order || 0]
    );
    res.json({ message: "Member added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateAlumniMember = async (req: Request, res: Response) => {
  try {
    const { member_type, student_year, name, role, display_order } = req.body;
    await db.query(
      "UPDATE alumni_members SET member_type=?, student_year=?, name=?, role=?, display_order=? WHERE id=?",
      [member_type, student_year, name, role, display_order, req.params.id]
    );
    res.json({ message: "Member updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteAlumniMember = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM alumni_members WHERE id=?", [req.params.id]);
    res.json({ message: "Member deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Admin CRUD: Events
export const createAlumniEvent = async (req: Request, res: Response) => {
  try {
    const { page_id, title, event_date, description, display_order } = req.body;
    await db.query(
      "INSERT INTO alumni_events (page_id, title, event_date, description, display_order) VALUES (?, ?, ?, ?, ?)",
      [page_id, title, event_date, description, display_order || 0]
    );
    res.json({ message: "Event added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateAlumniEvent = async (req: Request, res: Response) => {
  try {
    const { title, event_date, description, display_order } = req.body;
    await db.query(
      "UPDATE alumni_events SET title=?, event_date=?, description=?, display_order=? WHERE id=?",
      [title, event_date, description, display_order, req.params.id]
    );
    res.json({ message: "Event updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteAlumniEvent = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM alumni_events WHERE id=?", [req.params.id]);
    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Admin CRUD: Highlights
export const createAlumniHighlight = async (req: Request, res: Response) => {
  try {
    const { event_id, content, display_order } = req.body;
    await db.query(
      "INSERT INTO alumni_event_highlights (event_id, content, display_order) VALUES (?, ?, ?)",
      [event_id, content, display_order || 0]
    );
    res.json({ message: "Highlight added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateAlumniHighlight = async (req: Request, res: Response) => {
  try {
    const { content, display_order } = req.body;
    await db.query(
      "UPDATE alumni_event_highlights SET content=?, display_order=? WHERE id=?",
      [content, display_order, req.params.id]
    );
    res.json({ message: "Highlight updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteAlumniHighlight = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM alumni_event_highlights WHERE id=?", [req.params.id]);
    res.json({ message: "Highlight deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Admin CRUD: Gallery
export const createAlumniGallery = async (req: Request, res: Response) => {
  try {
    const { page_id, image_url, display_order } = req.body;
    await db.query(
      "INSERT INTO alumni_gallery (page_id, image_url, display_order) VALUES (?, ?, ?)",
      [page_id, image_url, display_order || 0]
    );
    res.json({ message: "Gallery image added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateAlumniGallery = async (req: Request, res: Response) => {
  try {
    const { image_url, display_order } = req.body;
    await db.query(
      "UPDATE alumni_gallery SET image_url=?, display_order=? WHERE id=?",
      [image_url, display_order, req.params.id]
    );
    res.json({ message: "Gallery image updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteAlumniGallery = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM alumni_gallery WHERE id=?", [req.params.id]);
    res.json({ message: "Gallery image deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Admin: Update Page Info
export const updateAlumniPageInfo = async (req: Request, res: Response) => {
  try {
    const { about_text, address, email, footer_note } = req.body;
    await db.query(
      "UPDATE alumni_pages SET about_text=?, address=?, email=?, footer_note=? WHERE slug='alumni-committee'",
      [about_text, address, email, footer_note]
    );
    res.json({ message: "Page info updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
