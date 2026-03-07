import { Request, Response } from "express";
import db from "../config/db";

// Committee Page
export const getSCSTCommittee = async (req: Request, res: Response) => {
  try {
    const [pageResult]: any = await db.query(
      "SELECT * FROM scst_pages WHERE slug='scst-committee'"
    );
    const page = pageResult[0];

    if (!page) return res.status(404).json({ message: "Not found" });

    const [members]: any = await db.query(
      "SELECT * FROM scst_committee_members WHERE page_id=? ORDER BY display_order ASC",
      [page.id]
    );

    const [responsibilities]: any = await db.query(
      "SELECT * FROM scst_committee_responsibilities WHERE page_id=? ORDER BY display_order ASC",
      [page.id]
    );

    res.json({ page, members, responsibilities });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Grievance Page
export const getSCSTGrievance = async (req: Request, res: Response) => {
  try {
    const [pageResult]: any = await db.query(
      "SELECT * FROM scst_grievance_pages WHERE slug='scst-grievance'"
    );
    const page = pageResult[0];

    if (!page) return res.status(404).json({ message: "Not found" });

    const [contacts]: any = await db.query(
      "SELECT * FROM scst_grievance_contacts WHERE page_id=? ORDER BY display_order ASC",
      [page.id]
    );

    res.json({ page, contacts });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin CRUD for Members
export const addMember = async (req: Request, res: Response) => {
  try {
    const { page_id, s_no, name, designation, role, contact, display_order } = req.body;
    await db.query(
      "INSERT INTO scst_committee_members (page_id, s_no, name, designation, role, contact, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [page_id, s_no, name, designation, role, contact, display_order]
    );
    res.json({ message: "Member added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateMember = async (req: Request, res: Response) => {
  try {
    const { s_no, name, designation, role, contact, display_order } = req.body;
    await db.query(
      "UPDATE scst_committee_members SET s_no=?, name=?, designation=?, role=?, contact=?, display_order=? WHERE id=?",
      [s_no, name, designation, role, contact, display_order, req.params.id]
    );
    res.json({ message: "Member updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM scst_committee_members WHERE id=?", [req.params.id]);
    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Admin CRUD for Responsibilities
export const addResponsibility = async (req: Request, res: Response) => {
  try {
    const { page_id, description, display_order } = req.body;
    await db.query(
      "INSERT INTO scst_committee_responsibilities (page_id, description, display_order) VALUES (?, ?, ?)",
      [page_id, description, display_order]
    );
    res.json({ message: "Responsibility added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateResponsibility = async (req: Request, res: Response) => {
  try {
    const { description, display_order } = req.body;
    await db.query(
      "UPDATE scst_committee_responsibilities SET description=?, display_order=? WHERE id=?",
      [description, display_order, req.params.id]
    );
    res.json({ message: "Responsibility updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteResponsibility = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM scst_committee_responsibilities WHERE id=?", [req.params.id]);
    res.json({ message: "Responsibility deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Admin CRUD for Grievance Contacts
export const addGrievanceContact = async (req: Request, res: Response) => {
  try {
    const { page_id, title, name, email, display_order } = req.body;
    await db.query(
      "INSERT INTO scst_grievance_contacts (page_id, title, name, email, display_order) VALUES (?, ?, ?, ?, ?)",
      [page_id, title, name, email, display_order]
    );
    res.json({ message: "Contact added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateGrievanceContact = async (req: Request, res: Response) => {
  try {
    const { title, name, email, display_order } = req.body;
    await db.query(
      "UPDATE scst_grievance_contacts SET title=?, name=?, email=?, display_order=? WHERE id=?",
      [title, name, email, display_order, req.params.id]
    );
    res.json({ message: "Contact updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteGrievanceContact = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM scst_grievance_contacts WHERE id=?", [req.params.id]);
    res.json({ message: "Contact deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Complaints System
export const submitComplaint = async (req: Request, res: Response) => {
  try {
    const { full_name, email, phone, department, subject, message } = req.body;
    await db.query(
      "INSERT INTO scst_complaints (full_name, email, phone, department, subject, message) VALUES (?, ?, ?, ?, ?, ?)",
      [full_name, email, phone, department, subject, message]
    );
    res.json({ message: "Complaint submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getComplaints = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM scst_complaints ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateComplaintStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    await db.query("UPDATE scst_complaints SET status=? WHERE id=?", [status, req.params.id]);
    res.json({ message: "Complaint status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
