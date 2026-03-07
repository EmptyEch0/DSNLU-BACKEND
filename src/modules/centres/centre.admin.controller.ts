import { Request, Response } from "express";
import db from "../../config/db";

// ==========================================
// CENTRE INFO CRUD
// ==========================================
export const createCentre = async (req: Request, res: Response) => {
  const { name, slug, description } = req.body;
  try {
    await db.query(
      "INSERT INTO centres (name, slug, description) VALUES (?, ?, ?)",
      [name, slug, description]
    );
    res.json({ message: "Centre created" });
  } catch (error) {
    res.status(500).json({ error: "Error creating centre" });
  }
};

// ==========================================
// COMMITTEE CRUD
// ==========================================
export const createCommitteeMember = async (req: Request, res: Response) => {
  let { centre_id, centre_slug, role, name, designation, display_order } = req.body;
  try {
    if (!centre_id && centre_slug) {
      const [centre]: any = await db.query("SELECT id FROM centres WHERE slug=?", [centre_slug]);
      if (centre.length) centre_id = centre[0].id;
    }
    
    if (!centre_id) return res.status(400).json({ error: "Centre not found" });

    await db.query(
      "INSERT INTO centre_committee_members (centre_id, role, name, designation, display_order) VALUES (?, ?, ?, ?, ?)",
      [centre_id, role, name, designation || null, display_order || 0]
    );
    res.json({ message: "Committee member added" });
  } catch (error) {
    res.status(500).json({ error: "Error adding committee member" });
  }
};

export const updateCommitteeMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, name, designation, display_order } = req.body;
  try {
    await db.query(
      "UPDATE centre_committee_members SET role=?, name=?, designation=?, display_order=? WHERE id=?",
      [role, name, designation, display_order, id]
    );
    res.json({ message: "Committee member updated" });
  } catch (error) {
    res.status(500).json({ error: "Error updating committee member" });
  }
};

export const deleteCommitteeMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM centre_committee_members WHERE id=?", [id]);
    res.json({ message: "Committee member deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting committee member" });
  }
};

export const reorderCommittee = async (req: Request, res: Response) => {
  const { orders } = req.body; // [{id: 1, order: 1}]
  try {
    for (let item of orders) {
      await db.query("UPDATE centre_committee_members SET display_order = ? WHERE id = ?", [item.order, item.id]);
    }
    res.json({ message: "Committee reordered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error reordering committee" });
  }
};

// ==========================================
// PUBLICATIONS CRUD
// ==========================================
export const createPublication = async (req: Request, res: Response) => {
  const { centre_id, title, subtitle, pdf_url, is_published, display_order } = req.body;
  try {
    await db.query(
      "INSERT INTO centre_publications (centre_id, title, subtitle, pdf_url, is_published, display_order) VALUES (?, ?, ?, ?, ?, ?)",
      [centre_id, title, subtitle, pdf_url, is_published, display_order || 0]
    );
    res.json({ message: "Publication added" });
  } catch (error) {
    res.status(500).json({ error: "Error adding publication" });
  }
};

export const updatePublication = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, subtitle, pdf_url, is_published, display_order } = req.body;
  try {
    await db.query(
      "UPDATE centre_publications SET title=?, subtitle=?, pdf_url=?, is_published=?, display_order=? WHERE id=?",
      [title, subtitle, pdf_url, is_published, display_order, id]
    );
    res.json({ message: "Publication updated" });
  } catch (error) {
    res.status(500).json({ error: "Error updating publication" });
  }
};

export const deletePublication = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM centre_publications WHERE id=?", [id]);
    res.json({ message: "Publication deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting publication" });
  }
};

export const reorderPublications = async (req: Request, res: Response) => {
  const { orders } = req.body;
  try {
    for (let item of orders) {
      await db.query("UPDATE centre_publications SET display_order = ? WHERE id = ?", [item.order, item.id]);
    }
    res.json({ message: "Publications reordered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error reordering publications" });
  }
};

// ==========================================
// EVENTS CRUD
// ==========================================
export const createEvent = async (req: Request, res: Response) => {
  const { centre_slug, title, event_date, description, guidance } = req.body;
  try {
    const [centre]: any = await db.query("SELECT id FROM centres WHERE slug = ? LIMIT 1", [centre_slug]);
    if (!centre.length) return res.status(404).json({ message: "Centre not found" });

    const centreId = centre[0].id;
    await db.query(
      "INSERT INTO centre_events (centre_id, title, event_date, description, guidance) VALUES (?, ?, ?, ?, ?)",
      [centreId, title, event_date, description, guidance]
    );
    res.json({ message: "Event created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, event_date, description, guidance } = req.body;
  try {
    await db.query(
      "UPDATE centre_events SET title = ?, event_date = ?, description = ?, guidance = ? WHERE id = ?",
      [title, event_date, description, guidance, id]
    );
    res.json({ message: "Event updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM centre_events WHERE id = ?", [id]);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const reorderEvents = async (req: Request, res: Response) => {
  const { orders } = req.body;
  try {
    for (let item of orders) {
      await db.query("UPDATE centre_events SET display_order = ? WHERE id = ?", [item.order, item.id]);
    }
    res.json({ message: "Events reordered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ==========================================
// GALLERY CRUD
// ==========================================
export const createGalleryImage = async (req: Request, res: Response) => {
  const { centre_slug, image_url } = req.body;
  try {
    const [centre]: any = await db.query("SELECT id FROM centres WHERE slug = ? LIMIT 1", [centre_slug]);
    if (!centre.length) return res.status(404).json({ message: "Centre not found" });

    await db.query(
      "INSERT INTO centre_event_gallery (centre_id, image_url) VALUES (?, ?)",
      [centre[0].id, image_url]
    );
    res.json({ message: "Gallery image added" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateGalleryImage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { image_url } = req.body;
  try {
    await db.query(
      "UPDATE centre_event_gallery SET image_url = ? WHERE id = ?",
      [image_url, id]
    );
    res.json({ message: "Gallery updated" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteGalleryImage = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM centre_event_gallery WHERE id = ?", [id]);
    res.json({ message: "Gallery image deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const reorderGallery = async (req: Request, res: Response) => {
  const { orders } = req.body;
  try {
    for (let item of orders) {
      await db.query("UPDATE centre_event_gallery SET display_order = ? WHERE id = ?", [item.order, item.id]);
    }
    res.json({ message: "Gallery reordered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
