import { Request, Response } from "express";
import db from "../config/db";

// Public: Get Sports Committee
export const getSportsCommittee = async (req: Request, res: Response) => {
  try {
    const [members] = await db.query(
      "SELECT * FROM sports_committee_members ORDER BY display_order ASC"
    );
    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Public: Get Sports Achievements & Timeline
export const getSportsAchievements = async (req: Request, res: Response) => {
  try {
    const [achievements]: any = await db.query(
      "SELECT * FROM sports_achievements ORDER BY display_order ASC"
    );

    for (let a of achievements) {
      const [medals] = await db.query(
        "SELECT id, medal_type, details, display_order FROM sports_medal_tally WHERE achievement_id=? ORDER BY display_order ASC",
        [a.id]
      );
      a.medals = medals;
    }

    const [timeline] = await db.query(
      "SELECT * FROM sports_timeline ORDER BY display_order ASC"
    );

    res.json({ achievements, timeline });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- ADMIN: COMMITTEE ---------------- */

export const createCommitteeMember = async (req: Request, res: Response) => {
  try {
    const { name, role, member_type, is_highlight, display_order } = req.body;
    await db.query(
      `INSERT INTO sports_committee_members
       (name, role, member_type, is_highlight, display_order)
       VALUES (?, ?, ?, ?, ?)`,
      [name, role, member_type, is_highlight || false, display_order || 0]
    );
    res.status(201).json({ message: "Committee member added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateCommitteeMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, role, member_type, is_highlight, display_order } = req.body;
    await db.query(
      `UPDATE sports_committee_members
       SET name=?, role=?, member_type=?, is_highlight=?, display_order=?
       WHERE id=?`,
      [name, role, member_type, is_highlight, display_order, id]
    );
    res.json({ message: "Committee member updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteCommitteeMember = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM sports_committee_members WHERE id=?", [req.params.id]);
    res.json({ message: "Committee member deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const reorderCommittee = async (req: Request, res: Response) => {
  try {
    const updates = req.body; // [{id, display_order}]
    for (let item of updates) {
      await db.query(
        "UPDATE sports_committee_members SET display_order=? WHERE id=?",
        [item.display_order, item.id]
      );
    }
    res.json({ message: "Committee reordered" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ---------------- ADMIN: ACHIEVEMENTS ---------------- */

export const createAchievement = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, description, image_url, badge_text, year_range, display_order } = req.body;
    await db.query(
      `INSERT INTO sports_achievements
       (title, subtitle, description, image_url, badge_text, year_range, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, subtitle, description, image_url, badge_text, year_range, display_order || 0]
    );
    res.status(201).json({ message: "Achievement created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateAchievement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, image_url, badge_text, year_range, display_order } = req.body;
    await db.query(
      `UPDATE sports_achievements
       SET title=?, subtitle=?, description=?, image_url=?, badge_text=?, year_range=?, display_order=?
       WHERE id=?`,
      [title, subtitle, description, image_url, badge_text, year_range, display_order, id]
    );
    res.json({ message: "Achievement updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteAchievement = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM sports_achievements WHERE id=?", [req.params.id]);
    res.json({ message: "Achievement deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const reorderAchievements = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    for (let item of updates) {
      await db.query(
        "UPDATE sports_achievements SET display_order=? WHERE id=?",
        [item.display_order, item.id]
      );
    }
    res.json({ message: "Achievements reordered" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ---------------- ADMIN: MEDAL TALLY ---------------- */

export const addMedal = async (req: Request, res: Response) => {
  try {
    const { achievement_id, medal_type, details, display_order } = req.body;
    await db.query(
      `INSERT INTO sports_medal_tally
       (achievement_id, medal_type, details, display_order)
       VALUES (?, ?, ?, ?)`,
      [achievement_id, medal_type, details, display_order || 0]
    );
    res.status(201).json({ message: "Medal added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateMedal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { medal_type, details, display_order } = req.body;
    await db.query(
      `UPDATE sports_medal_tally
       SET medal_type=?, details=?, display_order=?
       WHERE id=?`,
      [medal_type, details, display_order, id]
    );
    res.json({ message: "Medal updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteMedal = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM sports_medal_tally WHERE id=?", [req.params.id]);
    res.json({ message: "Medal deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ---------------- ADMIN: TIMELINE ---------------- */

export const createTimeline = async (req: Request, res: Response) => {
  try {
    const { year, title, description, display_order } = req.body;
    await db.query(
      `INSERT INTO sports_timeline
       (year, title, description, display_order)
       VALUES (?, ?, ?, ?)`,
      [year, title, description, display_order || 0]
    );
    res.status(201).json({ message: "Timeline added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateTimeline = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { year, title, description, display_order } = req.body;
    await db.query(
      `UPDATE sports_timeline
       SET year=?, title=?, description=?, display_order=?
       WHERE id=?`,
      [year, title, description, display_order, id]
    );
    res.json({ message: "Timeline updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteTimeline = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM sports_timeline WHERE id=?", [req.params.id]);
    res.json({ message: "Timeline deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const reorderTimeline = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    for (let item of updates) {
      await db.query(
        "UPDATE sports_timeline SET display_order=? WHERE id=?",
        [item.display_order, item.id]
      );
    }
    res.json({ message: "Timeline reordered" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ---------------- SPORTS CONTACT & ENQUIRIES ---------------- */

// Public: Get Contact Info
export const getContactInfo = async (req: Request, res: Response) => {
  try {
    const [data] = await db.query("SELECT * FROM sports_contact_info LIMIT 1");
    res.json((data as any[])[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Public: Submit Enquiry
export const createEnquiry = async (req: Request, res: Response) => {
  try {
    const { full_name, email, phone, subject, message } = req.body;
    await db.query(
      `INSERT INTO sports_enquiries
       (full_name, email, phone, subject, message)
       VALUES (?, ?, ?, ?, ?)`,
      [full_name, email, phone, subject, message]
    );
    res.status(201).json({ message: "Inquiry submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Admin: Update Contact Info
export const updateContactInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      official_email,
      official_email_note,
      physical_director_name,
      physical_director_note
    } = req.body;

    await db.query(
      `UPDATE sports_contact_info
       SET title=?, description=?, official_email=?, official_email_note=?,
           physical_director_name=?, physical_director_note=?
       WHERE id=?`,
      [
        title,
        description,
        official_email,
        official_email_note,
        physical_director_name,
        physical_director_note,
        id
      ]
    );
    res.json({ message: "Contact info updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Admin: Get All Enquiries
export const getAllEnquiries = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT * FROM sports_enquiries ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Admin: Update Enquiry Status
export const updateEnquiryStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    await db.query("UPDATE sports_enquiries SET status=? WHERE id=?", [status, req.params.id]);
    res.json({ message: "Status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Admin: Delete Enquiry
export const deleteEnquiry = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM sports_enquiries WHERE id=?", [req.params.id]);
    res.json({ message: "Enquiry deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
