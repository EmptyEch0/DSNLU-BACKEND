import { Request, Response } from "express";
import db from "../config/db";

// 🔹 GET MAIN COMPETITION (Public)
export const getNMC = async (req: Request, res: Response) => {
  try {
    const [competitions]: any = await db.query(
      "SELECT * FROM competitions WHERE slug = 'nmc' AND is_active = 1 LIMIT 1"
    );

    const competition = competitions[0];

    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    const [timeline]: any = await db.query(
      "SELECT * FROM competition_timelines WHERE competition_id = ? ORDER BY display_order ASC",
      [competition.id]
    );

    const [registrations]: any = await db.query(
      "SELECT * FROM competition_registration WHERE competition_id = ? LIMIT 1",
      [competition.id]
    );
    const registration = registrations[0] || null;

    const [contacts]: any = await db.query(
      "SELECT * FROM competition_contacts WHERE competition_id = ? LIMIT 1",
      [competition.id]
    );
    const contact = contacts[0] || null;

    const [coordinators]: any = await db.query(
      "SELECT * FROM competition_coordinators WHERE competition_id = ? ORDER BY display_order ASC",
      [competition.id]
    );

    const [editions]: any = await db.query(
      "SELECT * FROM competition_editions WHERE competition_id = ? ORDER BY display_order DESC",
      [competition.id]
    );

    const editionList = [];
    for (const edition of editions) {
      const [gallery]: any = await db.query(
        "SELECT * FROM competition_gallery WHERE edition_id = ? ORDER BY display_order ASC",
        [edition.id]
      );
      editionList.push({
        ...edition,
        gallery
      });
    }

    res.json({
      ...competition,
      timeline,
      registration,
      contact,
      coordinators,
      editions: editionList
    });

  } catch (error) {
    console.error("Error fetching NMC data:", error);
    res.status(500).json({ message: "Failed to fetch competition data" });
  }
};

// 🔹 UPDATE MAIN COMPETITION
export const updateCompetition = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, description, hero_logo } = req.body;

    await db.query(
      `UPDATE competitions 
       SET title=?, subtitle=?, description=?, hero_logo=? 
       WHERE slug='nmc'`,
      [title, subtitle, description, hero_logo]
    );

    res.json({ message: "Competition updated" });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// 🔹 TIMELINE CRUD
export const addTimeline = async (req: Request, res: Response) => {
  try {
    const { competition_id, timeline_date, timeline_event, display_order } = req.body;

    await db.query(
      `INSERT INTO competition_timelines 
       (competition_id, timeline_date, timeline_event, display_order)
       VALUES (?, ?, ?, ?)`,
      [competition_id, timeline_date, timeline_event, display_order]
    );

    res.json({ message: "Timeline added" });
  } catch (err) {
    res.status(500).json({ message: "Creation failed" });
  }
};

export const updateTimeline = async (req: Request, res: Response) => {
  try {
    const { timeline_date, timeline_event, display_order } = req.body;

    await db.query(
      `UPDATE competition_timelines 
       SET timeline_date=?, timeline_event=?, display_order=? 
       WHERE id=?`,
      [timeline_date, timeline_event, display_order, req.params.id]
    );

    res.json({ message: "Timeline updated" });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

export const deleteTimeline = async (req: Request, res: Response) => {
  try {
    await db.query(`DELETE FROM competition_timelines WHERE id=?`, [req.params.id]);
    res.json({ message: "Timeline deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// 🔹 REGISTRATION UPDATE
export const updateRegistration = async (req: Request, res: Response) => {
  try {
    const {
      provisional_start,
      provisional_end,
      final_start,
      final_end,
      registration_fee,
      capacity,
      brochure_link,
      register_link
    } = req.body;

    await db.query(
      `UPDATE competition_registration
       SET provisional_start=?, provisional_end=?, 
           final_start=?, final_end=?, 
           registration_fee=?, capacity=?, 
           brochure_link=?, register_link=?
       WHERE id=?`,
      [
        provisional_start,
        provisional_end,
        final_start,
        final_end,
        registration_fee,
        capacity,
        brochure_link,
        register_link,
        req.params.id
      ]
    );

    res.json({ message: "Registration updated" });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// 🔹 CONTACT UPDATE
export const updateContact = async (req: Request, res: Response) => {
  try {
    const {
      email,
      linkedin_link,
      instagram_link,
      faculty_name,
      faculty_phone,
      faculty_email
    } = req.body;

    await db.query(
      `UPDATE competition_contacts
       SET email=?, linkedin_link=?, instagram_link=?,
           faculty_name=?, faculty_phone=?, faculty_email=?
       WHERE id=?`,
      [
        email,
        linkedin_link,
        instagram_link,
        faculty_name,
        faculty_phone,
        faculty_email,
        req.params.id
      ]
    );

    res.json({ message: "Contact updated" });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// 🔹 COORDINATORS CRUD
export const addCoordinator = async (req: Request, res: Response) => {
  try {
    const { competition_id, coordinator_name, role, display_order } = req.body;

    await db.query(
      `INSERT INTO competition_coordinators 
       (competition_id, coordinator_name, role, display_order)
       VALUES (?, ?, ?, ?)`,
      [competition_id, coordinator_name, role, display_order]
    );

    res.json({ message: "Coordinator added" });
  } catch (err) {
    res.status(500).json({ message: "Creation failed" });
  }
};

export const deleteCoordinator = async (req: Request, res: Response) => {
  try {
    await db.query(`DELETE FROM competition_coordinators WHERE id=?`, [req.params.id]);
    res.json({ message: "Coordinator deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// 🔹 EDITIONS CRUD
export const addEdition = async (req: Request, res: Response) => {
  try {
    const { competition_id, edition_title, edition_year, description, is_archived, display_order } = req.body;

    await db.query(
      `INSERT INTO competition_editions
       (competition_id, edition_title, edition_year, description, is_archived, display_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [competition_id, edition_title, edition_year, description, is_archived, display_order]
    );

    res.json({ message: "Edition added" });
  } catch (err) {
    res.status(500).json({ message: "Creation failed" });
  }
};

export const updateEdition = async (req: Request, res: Response) => {
  try {
    const { edition_title, edition_year, description, is_archived, display_order } = req.body;

    await db.query(
      `UPDATE competition_editions
       SET edition_title=?, edition_year=?, description=?, 
           is_archived=?, display_order=?
       WHERE id=?`,
      [edition_title, edition_year, description, is_archived, display_order, req.params.id]
    );

    res.json({ message: "Edition updated" });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

export const deleteEdition = async (req: Request, res: Response) => {
  try {
    await db.query(`DELETE FROM competition_editions WHERE id=?`, [req.params.id]);
    res.json({ message: "Edition deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// 🔹 GALLERY CRUD
export const addGalleryImage = async (req: Request, res: Response) => {
  try {
    const { edition_id, image_url, display_order } = req.body;

    await db.query(
      `INSERT INTO competition_gallery
       (edition_id, image_url, display_order)
       VALUES (?, ?, ?)`,
      [edition_id, image_url, display_order]
    );

    res.json({ message: "Image added" });
  } catch (err) {
    res.status(500).json({ message: "Creation failed" });
  }
};

export const deleteGalleryImage = async (req: Request, res: Response) => {
  try {
    await db.query(`DELETE FROM competition_gallery WHERE id=?`, [req.params.id]);
    res.json({ message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
