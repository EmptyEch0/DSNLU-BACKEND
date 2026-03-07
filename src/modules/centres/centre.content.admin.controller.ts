import { Request, Response } from "express";
import db from "../../config/db";

// Public Fetch
export const getCentreContent = async (req: Request, res: Response) => {
  const { centreId } = req.params;
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM centre_content WHERE centre_id=? ORDER BY display_order",
      [centreId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch centre content" });
  }
};

export const getCommittee = async (req: Request, res: Response) => {
  const { centreId } = req.params;
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM centre_committees WHERE centre_id=? ORDER BY display_order",
      [centreId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch committee" });
  }
};

export const getBrochure = async (req: Request, res: Response) => {
  const { centreId } = req.params;
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM centre_brochures WHERE centre_id=? AND is_active=1",
      [centreId]
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch brochure" });
  }
};

// Admin CRUD
export const createCommittee = async (req: Request, res: Response) => {
  const { centre_id, role, name, display_order } = req.body;
  try {
    await db.query(
      "INSERT INTO centre_committees (centre_id, role, name, display_order) VALUES (?, ?, ?, ?)",
      [centre_id, role, name, display_order]
    );
    res.json({ message: "Created" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create committee member" });
  }
};

export const updateCommittee = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, name, display_order } = req.body;
  try {
    await db.query(
      "UPDATE centre_committees SET role=?, name=?, display_order=? WHERE id=?",
      [role, name, display_order, id]
    );
    res.json({ message: "Updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update committee member" });
  }
};

export const deleteCommittee = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM centre_committees WHERE id=?", [id]);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete committee member" });
  }
};

export const updateContent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    await db.query(
      "UPDATE centre_content SET title=?, content=? WHERE id=?",
      [title, content, id]
    );
    res.json({ message: "Updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update content" });
  }
};

export const createBrochure = async (req: Request, res: Response) => {
  const { centre_id, title, file_url, is_active } = req.body;
  try {
    await db.query(
      "INSERT INTO centre_brochures (centre_id, title, file_url, is_active) VALUES (?, ?, ?, ?)",
      [centre_id, title, file_url, is_active ?? 1]
    );
    res.json({ message: "Brochure created" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create brochure" });
  }
};

export const updateBrochure = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, file_url, is_active } = req.body;
  try {
    await db.query(
      "UPDATE centre_brochures SET title=?, file_url=?, is_active=? WHERE id=?",
      [title, file_url, is_active, id]
    );
    res.json({ message: "Brochure updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update brochure" });
  }
};
export const reorderCommittee = async (req: Request, res: Response) => {
  const { orders } = req.body;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    for (const item of orders) {
      await connection.query(
        "UPDATE centre_committees SET display_order = ? WHERE id = ?",
        [item.display_order, item.id]
      );
    }
    await connection.commit();
    res.json({ message: "Reordered successfully" });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: "Failed to reorder committee" });
  } finally {
    connection.release();
  }
};

// Student Teams
export const getStudentTeams = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [groups]: any = await db.query(
      "SELECT * FROM centre_student_team_groups WHERE centre_id=? ORDER BY display_order",
      [id]
    );

    for (let group of groups) {
      const [members]: any = await db.query(
        "SELECT * FROM centre_student_team_members WHERE group_id=? ORDER BY display_order",
        [group.id]
      );
      group.members = members;
    }

    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch student teams" });
  }
};

export const createTeamGroup = async (req: Request, res: Response) => {
  const { centre_id, role_title, display_order } = req.body;
  try {
    await db.query(
      "INSERT INTO centre_student_team_groups (centre_id, role_title, display_order) VALUES (?, ?, ?)",
      [centre_id, role_title, display_order]
    );
    res.json({ message: "Group created" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create team group" });
  }
};

export const updateTeamGroup = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role_title, display_order } = req.body;
  try {
    await db.query(
      "UPDATE centre_student_team_groups SET role_title=?, display_order=? WHERE id=?",
      [role_title, display_order, id]
    );
    res.json({ message: "Group updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update team group" });
  }
};

export const deleteTeamGroup = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM centre_student_team_groups WHERE id=?", [id]);
    res.json({ message: "Group deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete team group" });
  }
};

export const createTeamMember = async (req: Request, res: Response) => {
  const { group_id, name, display_order } = req.body;
  try {
    await db.query(
      "INSERT INTO centre_student_team_members (group_id, name, display_order) VALUES (?, ?, ?)",
      [group_id, name, display_order]
    );
    res.json({ message: "Member added" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add team member" });
  }
};

export const updateTeamMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, display_order } = req.body;
  try {
    await db.query(
      "UPDATE centre_student_team_members SET name=?, display_order=? WHERE id=?",
      [name, display_order, id]
    );
    res.json({ message: "Member updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update team member" });
  }
};

export const deleteTeamMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM centre_student_team_members WHERE id=?", [id]);
    res.json({ message: "Member deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete team member" });
  }
};

export const reorderTeamGroup = async (req: Request, res: Response) => {
  const { orders } = req.body;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    for (const item of orders) {
      await connection.query(
        "UPDATE centre_student_team_groups SET display_order = ? WHERE id = ?",
        [item.display_order, item.id]
      );
    }
    await connection.commit();
    res.json({ message: "Groups reordered" });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: "Failed to reorder groups" });
  } finally {
    connection.release();
  }
};

export const reorderTeamMember = async (req: Request, res: Response) => {
  const { orders } = req.body;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    for (const item of orders) {
      await connection.query(
        "UPDATE centre_student_team_members SET display_order = ? WHERE id = ?",
        [item.display_order, item.id]
      );
    }
    await connection.commit();
    res.json({ message: "Members reordered" });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: "Failed to reorder members" });
  } finally {
    connection.release();
  }
};

