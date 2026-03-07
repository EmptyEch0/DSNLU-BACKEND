import { Request, Response } from "express";
import db from "../../config/db";
const pool = db;

// Public Retrieval
export const getCentreBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const [centres]: any = await db.query(
      `SELECT * FROM centres WHERE slug = ? LIMIT 1`,
      [slug]
    );

    if (!centres.length) {
      return res.status(404).json({ message: "Centre not found" });
    }

    const centre = centres[0];
    const centreId = centre.id;

    const [committee]: any = await db.query(
      `SELECT * FROM centre_committee_members
       WHERE centre_id = ?
       ORDER BY display_order ASC`,
      [centreId]
    );

    const [publications]: any = await db.query(
      `SELECT * FROM centre_publications
       WHERE centre_id = ?
       ORDER BY display_order ASC`,
      [centreId]
    );

    res.json({
      centre,
      committee,
      publications
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getCentreFull = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const [centres]: any = await db.query(
      `SELECT * FROM centres WHERE slug = ? LIMIT 1`,
      [slug]
    );

    if (!centres.length) {
      return res.status(404).json({ message: "Centre not found" });
    }

    const centre = centres[0];
    const centreId = centre.id;

    const [committee]: any = await db.query(
      `SELECT * FROM centre_committee_members
       WHERE centre_id = ?
       ORDER BY display_order ASC`,
      [centreId]
    );

    const [events]: any = await db.query(
      `SELECT * FROM centre_events
       WHERE centre_id = ?
       ORDER BY display_order ASC`,
      [centreId]
    );

    const [gallery]: any = await db.query(
      `SELECT * FROM centre_event_gallery
       WHERE centre_id = ?
       ORDER BY display_order ASC`,
      [centreId]
    );

    res.json({
      centre,
      committee,
      events,
      gallery
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getCentreResearch = async (req: Request, res: Response) => {
  const { centreSlug } = req.params;

  try {
    // Get centre
    const [centres]: any = await db.query(
      `SELECT id FROM centres WHERE slug = ? LIMIT 1`,
      [centreSlug]
    );

    if (!centres.length) {
      return res.status(404).json({ message: "Centre not found" });
    }

    const centreId = centres[0].id;

    // Get Years
    const [years]: any = await db.query(
      `SELECT * FROM centre_research_years
       WHERE centre_id = ?
       ORDER BY display_order ASC`,
      [centreId]
    );

    // Get Events
    const [events]: any = await db.query(
      `SELECT * FROM centre_research_events
       ORDER BY display_order ASC`
    );

    // Map events to years
    const structuredYears = years.map((year: any) => ({
      id: year.id,
      year: year.year_label,
      events: events
        .filter((e: any) => e.year_id === year.id)
        .map((e: any) => ({
          id: e.id,
          text: e.event_text
        }))
    }));

    // Get Gallery
    const [gallery]: any = await db.query(
      `SELECT image_url FROM centre_research_gallery
       WHERE centre_id = ?
       ORDER BY display_order ASC`,
      [centreId]
    );

    res.json({
      timeline: structuredYears,
      gallery: gallery
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getLICCommittee = async (req: Request, res: Response) => {
  try {
    const centreId = 5;

    const [honorary]: any = await pool.query(
      `SELECT name, designation as role_title FROM centre_committee_members 
       WHERE centre_id = ? AND role = 'honorary' ORDER BY display_order`,
      [centreId]
    );

    const [faculty]: any = await pool.query(
      `SELECT name, designation as role_title FROM centre_committee_members 
       WHERE centre_id = ? AND role = 'faculty' ORDER BY display_order`,
      [centreId]
    );

    const [students]: any = await pool.query(
      `SELECT name, designation as semester FROM centre_committee_members 
       WHERE centre_id = ? AND role = 'student' ORDER BY display_order`,
      [centreId]
    );

    const [trainees]: any = await pool.query(
      `SELECT name, designation as semester FROM centre_committee_members 
       WHERE centre_id = ? AND role = 'trainee' ORDER BY display_order`,
      [centreId]
    );

    return res.json({ honorary, faculty, students, trainees });
  } catch (error) {
    console.error("getLICCommittee error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCIPRBoard = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      `SELECT id, role, name, designation, email, display_order 
       FROM centre_committee_members 
       WHERE centre_id = (SELECT id FROM centres WHERE slug = 'cipr')
       ORDER BY display_order ASC`
    );
    return res.json(rows);
  } catch (error) {
    console.error("getCIPRBoard error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCentreEvents = async (req: Request, res: Response) => {
  try {
    const { centreId } = req.params;
    console.log("getCentreEvents called with centreId:", centreId);

    const [events]: any = await pool.query(
      `SELECT id, title, event_date, description, guidance, display_order 
       FROM centre_events 
       WHERE centre_id = ? 
       ORDER BY display_order`,
      [centreId]
    );

    console.log("events fetched:", events);
    return res.json({ events });
  } catch (error) {
    console.error("getCentreEvents error:", error);
    return res.status(500).json({ message: "Internal server error", error: String(error) });
  }
};

// Admin CRUD - Centres
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

// Admin CRUD - Committee
export const addCommitteeMember = async (req: Request, res: Response) => {
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

// Admin CRUD - Publications
export const addPublication = async (req: Request, res: Response) => {
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
    await db.query("DELETE FROM centre_publications WHERE id = ?", [id]);
    res.json({ message: "Publication deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting publication", error });
  }
};

// Admin CRUD - Events
export const addEvent = async (req: Request, res: Response) => {
  try {
    const { year_id, event_text, display_order } = req.body;
    await db.query(
      "INSERT INTO centre_research_events (year_id, event_text, display_order) VALUES (?, ?, ?)",
      [year_id, event_text, display_order]
    );
    res.json({ message: "Event added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding event", error });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { event_text, display_order } = req.body;
    await db.query(
      "UPDATE centre_research_events SET event_text = ?, display_order = ? WHERE id = ?",
      [event_text, display_order, id]
    );
    res.json({ message: "Event updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM centre_research_events WHERE id = ?", [id]);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
};

// Admin CRUD - Gallery
export const addGalleryItem = async (req: Request, res: Response) => {
  try {
    const { centre_id, image_url, display_order } = req.body;
    await db.query(
      "INSERT INTO centre_research_gallery (centre_id, image_url, display_order) VALUES (?, ?, ?)",
      [centre_id, image_url, display_order]
    );
    res.json({ message: "Gallery item added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding gallery item", error });
  }
};

export const deleteGalleryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM centre_research_gallery WHERE id = ?", [id]);
    res.json({ message: "Gallery item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting gallery item", error });
  }
};

// Reorder
export const reorderItems = async (req: Request, res: Response) => {
  try {
    const { table, items } = req.body;
    const allowedTables = [
      "centre_publications",
      "centre_research_events",
      "centre_research_gallery",
      "centre_committee_members"
    ];

    if (!allowedTables.includes(table)) {
      return res.status(400).json({ message: "Invalid table name" });
    }

    for (const item of items) {
      await db.query(
        `UPDATE ${table} SET display_order = ? WHERE id = ?`,
        [item.display_order, item.id]
      );
    }
    res.json({ message: "Reordered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error reordering items", error });
  }
};
