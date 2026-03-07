import { Request, Response } from "express";
import {
  getAcademicCouncilMembers,
  addAcademicCouncilMember,
  updateAcademicCouncilMember,
  deleteAcademicCouncilMember,
  reorderAcademicCouncil,
} from "../services/academicCouncil.service";

export const fetchAcademicCouncil = async (req: Request, res: Response) => {
  try {
    const members = await getAcademicCouncilMembers();
    res.status(200).json(members);
  } catch (error) {
    console.error("Academic Council Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createAcademicCouncil = async (req: Request, res: Response) => {
  try {
    const { member_name, designation } = req.body;
    const member = await addAcademicCouncilMember(member_name, designation);
    res.status(201).json(member);
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ message: "Failed to add member" });
  }
};

export const editAcademicCouncil = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { member_name, designation } = req.body;
    const updated = await updateAcademicCouncilMember(id, member_name, designation);
    res.json(updated);
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).json({ message: "Failed to update" });
  }
};

export const removeAcademicCouncil = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteAcademicCouncilMember(id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ message: "Delete failed" });
  }
};

export const reorderAcademic = async (req: Request, res: Response) => {
  try {
    const { orders } = req.body;
    await reorderAcademicCouncil(orders);
    res.json({ message: "Reordered successfully" });
  } catch (error) {
    console.error("Error reordering:", error);
    res.status(500).json({ message: "Reorder failed" });
  }
};
