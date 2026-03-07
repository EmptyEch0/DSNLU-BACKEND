import { Request, Response } from "express";
import {
  getGeneralCouncilMembers,
  addGeneralCouncilMember,
  updateGeneralCouncilMember,
  deleteGeneralCouncilMember,
  reorderGeneralCouncil,
} from "../services/generalCouncil.service";

export const fetchGeneralCouncil = async (req: Request, res: Response) => {
  try {
    const members = await getGeneralCouncilMembers();
    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching General Council:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createGeneralCouncil = async (req: Request, res: Response) => {
  try {
    const { member_name, designation } = req.body;
    const member = await addGeneralCouncilMember(member_name, designation);
    res.status(201).json(member);
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ message: "Failed to add member" });
  }
};

export const editGeneralCouncil = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { member_name, designation } = req.body;
    const updated = await updateGeneralCouncilMember(id, member_name, designation);
    res.json(updated);
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).json({ message: "Failed to update" });
  }
};

export const removeGeneralCouncil = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteGeneralCouncilMember(id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ message: "Delete failed" });
  }
};

export const reorderGeneral = async (req: Request, res: Response) => {
  try {
    const { orders } = req.body;
    await reorderGeneralCouncil(orders);
    res.json({ message: "Reordered successfully" });
  } catch (error) {
    console.error("Error reordering:", error);
    res.status(500).json({ message: "Reorder failed" });
  }
};
