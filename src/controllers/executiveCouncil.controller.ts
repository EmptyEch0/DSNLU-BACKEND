import { Request, Response } from "express";
import {
  getExecutiveCouncilMembers,
  addExecutiveCouncilMember,
  updateExecutiveCouncilMember,
  deleteExecutiveCouncilMember,
  reorderExecutiveCouncil,
} from "../services/executiveCouncil.service";

export const fetchExecutiveCouncil = async (req: Request, res: Response) => {
  try {
    const members = await getExecutiveCouncilMembers();
    res.status(200).json(members);
  } catch (error) {
    console.error("Executive Council Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createExecutiveCouncil = async (req: Request, res: Response) => {
  try {
    const { member_name, designation } = req.body;
    const member = await addExecutiveCouncilMember(member_name, designation);
    res.status(201).json(member);
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ message: "Failed to add member" });
  }
};

export const editExecutiveCouncil = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { member_name, designation } = req.body;
    const updated = await updateExecutiveCouncilMember(id, member_name, designation);
    res.json(updated);
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).json({ message: "Failed to update" });
  }
};

export const removeExecutiveCouncil = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteExecutiveCouncilMember(id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ message: "Delete failed" });
  }
};

export const reorderExecutive = async (req: Request, res: Response) => {
  try {
    const { orders } = req.body;
    await reorderExecutiveCouncil(orders);
    res.json({ message: "Reordered successfully" });
  } catch (error) {
    console.error("Error reordering:", error);
    res.status(500).json({ message: "Reorder failed" });
  }
};
