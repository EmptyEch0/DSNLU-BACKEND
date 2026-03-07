import { Request, Response } from "express";
import db from "../config/db";

// --- PUBLIC: Get MAS Data ---
export const getMASData = async (req: Request, res: Response) => {
  try {
    const [faculty] = await db.query(
      "SELECT * FROM mas_faculty ORDER BY display_order ASC"
    );

    const [officeBearers] = await db.query(
      "SELECT * FROM mas_office_bearers ORDER BY display_order ASC"
    );

    const [groups] = await db.query(
      "SELECT * FROM mas_member_groups ORDER BY display_order ASC"
    );

    for (let g of groups as any[]) {
      const [members] = await db.query(
        "SELECT * FROM mas_members WHERE group_id=? ORDER BY display_order ASC",
        [g.id]
      );
      g.members = members;
    }

    const [batches] = await db.query(
      "SELECT * FROM mas_achievement_batches ORDER BY display_order ASC"
    );

    for (let b of batches as any[]) {
      const [items] = await db.query(
        "SELECT * FROM mas_achievement_items WHERE batch_id=? ORDER BY display_order ASC",
        [b.id]
      );
      b.items = items;
    }

    res.json({
      faculty,
      officeBearers,
      memberGroups: groups,
      achievements: batches
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- ADMIN: Faculty ---
export const createFaculty = async (req: Request, res: Response) => {
  try {
    const { name, designation, display_order } = req.body;
    await db.query(
      "INSERT INTO mas_faculty (name, designation, display_order) VALUES (?, ?, ?)",
      [name, designation, display_order || 0]
    );
    res.status(201).json({ message: "Faculty added" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateFaculty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, designation, display_order } = req.body;
    await db.query(
      "UPDATE mas_faculty SET name=?, designation=?, display_order=? WHERE id=?",
      [name, designation, display_order, id]
    );
    res.json({ message: "Faculty updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteFaculty = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM mas_faculty WHERE id=?", [req.params.id]);
    res.json({ message: "Faculty deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// --- ADMIN: Office Bearers ---
export const createOfficeBearer = async (req: Request, res: Response) => {
  try {
    const { name, role, display_order } = req.body;
    await db.query(
      "INSERT INTO mas_office_bearers (name, role, display_order) VALUES (?, ?, ?)",
      [name, role, display_order || 0]
    );
    res.status(201).json({ message: "Office bearer added" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateOfficeBearer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, role, display_order } = req.body;
    await db.query(
      "UPDATE mas_office_bearers SET name=?, role=?, display_order=? WHERE id=?",
      [name, role, display_order, id]
    );
    res.json({ message: "Office bearer updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteOfficeBearer = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM mas_office_bearers WHERE id=?", [req.params.id]);
    res.json({ message: "Office bearer deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// --- ADMIN: Member Groups & Members ---
export const createGroup = async (req: Request, res: Response) => {
  try {
    const { year_label, display_order } = req.body;
    await db.query("INSERT INTO mas_member_groups (year_label, display_order) VALUES (?, ?)", [year_label, display_order || 0]);
    res.status(201).json({ message: "Group added" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { year_label, display_order } = req.body;
    await db.query("UPDATE mas_member_groups SET year_label=?, display_order=? WHERE id=?", [year_label, display_order, id]);
    res.json({ message: "Group updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM mas_member_groups WHERE id=?", [req.params.id]);
    res.json({ message: "Group deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const createMember = async (req: Request, res: Response) => {
  try {
    const { group_id, name, display_order } = req.body;
    await db.query("INSERT INTO mas_members (group_id, name, display_order) VALUES (?, ?, ?)", [group_id, name, display_order || 0]);
    res.status(201).json({ message: "Member added" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, display_order } = req.body;
    await db.query("UPDATE mas_members SET name=?, display_order=? WHERE id=?", [name, display_order, id]);
    res.json({ message: "Member updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM mas_members WHERE id=?", [req.params.id]);
    res.json({ message: "Member deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// --- ADMIN: Achievements ---
export const createAchievementBatch = async (req: Request, res: Response) => {
  try {
    const { title, display_order } = req.body;
    await db.query("INSERT INTO mas_achievement_batches (title, display_order) VALUES (?, ?)", [title, display_order || 0]);
    res.status(201).json({ message: "Achievement batch added" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateAchievementBatch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, display_order } = req.body;
    await db.query("UPDATE mas_achievement_batches SET title=?, display_order=? WHERE id=?", [title, display_order, id]);
    res.json({ message: "Achievement batch updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteAchievementBatch = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM mas_achievement_batches WHERE id=?", [req.params.id]);
    res.json({ message: "Achievement batch deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const createAchievementItem = async (req: Request, res: Response) => {
  try {
    const { batch_id, description, display_order } = req.body;
    await db.query("INSERT INTO mas_achievement_items (batch_id, description, display_order) VALUES (?, ?, ?)", [batch_id, description, display_order || 0]);
    res.status(201).json({ message: "Achievement item added" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateAchievementItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { description, display_order } = req.body;
    await db.query("UPDATE mas_achievement_items SET description=?, display_order=? WHERE id=?", [description, display_order, id]);
    res.json({ message: "Achievement item updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteAchievementItem = async (req: Request, res: Response) => {
  try {
    await db.query("DELETE FROM mas_achievement_items WHERE id=?", [req.params.id]);
    res.json({ message: "Achievement item deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// --- REORDERING ---
export const reorderMAS = async (req: Request, res: Response) => {
  try {
    const { table, updates } = req.body;
    const validTables = ['mas_faculty', 'mas_office_bearers', 'mas_member_groups', 'mas_members', 'mas_achievement_batches', 'mas_achievement_items'];
    if (!validTables.includes(table)) return res.status(400).json({ message: "Invalid table" });

    for (let item of updates) {
      await db.query(`UPDATE ${table} SET display_order=? WHERE id=?`, [item.display_order, item.id]);
    }
    res.json({ message: "Reordered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
