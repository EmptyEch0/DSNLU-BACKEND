import { Request, Response } from "express";
import db from "../config/db";

// Public: Get LSC Members
export const getLSCMembers = async (req: Request, res: Response) => {
  try {
    const [faculty] = await db.query(
      "SELECT * FROM lsc_members WHERE member_type='faculty' ORDER BY display_order ASC"
    );

    const [students] = await db.query(
      "SELECT * FROM lsc_members WHERE member_type='student' ORDER BY display_order ASC"
    );

    res.json({ faculty, students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Public: Get LSC Contact Info
export const getLSCContact = async (req: Request, res: Response) => {
  try {
    const [data]: any = await db.query("SELECT * FROM lsc_contact_info LIMIT 1");
    res.json(data[0] || {
      university_name: "Damodaram Sanjivayya National Law University",
      address_line1: "NYAYAPRASTHA, Sabbavaram",
      city: "Visakhapatnam – 531035, Andhra Pradesh, India",
      contact_email: "lsc@dsnlu.ac.in"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Public: Store Enquiry
export const createEnquiry = async (req: Request, res: Response) => {
  try {
    const { full_name, email, phone, subject, message } = req.body;

    await db.query(
      "INSERT INTO lsc_enquiries (full_name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
      [full_name, email, phone, subject, message]
    );

    res.status(201).json({ message: "Submitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin CRUD: Members
export const createMember = async (req: Request, res: Response) => {
  try {
    const { name, designation, role, member_type, display_order } = req.body;
    await db.query(
      `INSERT INTO lsc_members 
       (name, designation, role, member_type, display_order)
       VALUES (?, ?, ?, ?, ?)`,
      [name, designation, role, member_type, display_order || 0]
    );
    res.status(201).json({ message: "Member created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, designation, role, member_type, display_order } = req.body;
    await db.query(
      `UPDATE lsc_members 
       SET name=?, designation=?, role=?, member_type=?, display_order=? 
       WHERE id=?`,
      [name, designation, role, member_type, display_order, id]
    );
    res.json({ message: "Member updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM lsc_members WHERE id=?", [req.params.id]);
    res.json({ message: "Member deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Admin: Update Contact Info
export const updateContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      university_name,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      country,
      contact_person,
      contact_designation,
      contact_email
    } = req.body;

    await db.query(
      `UPDATE lsc_contact_info 
       SET university_name=?, address_line1=?, address_line2=?, city=?, state=?, 
           pincode=?, country=?, contact_person=?, contact_designation=?, contact_email=? 
       WHERE id=?`,
      [
        university_name,
        address_line1,
        address_line2,
        city,
        state,
        pincode,
        country,
        contact_person,
        contact_designation,
        contact_email,
        id
      ]
    );

    res.json({ message: "Contact updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
