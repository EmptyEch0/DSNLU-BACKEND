import { Request, Response } from "express";
import {
  getPlanningBoardMembers,
  addPlanningBoardMember,
  updatePlanningBoardMember,
  deletePlanningBoardMember,
  reorderPlanningBoard,
} from "../services/planningBoard.service";

export const fetchPlanningBoard = async (req: Request, res: Response) => {
  try {
    const members = await getPlanningBoardMembers();
    res.status(200).json(members);
  } catch (error) {
    console.error("Planning Board Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createPlanningBoard = async (req: Request, res: Response) => {
  try {
    const { member_name, designation } = req.body;
    const member = await addPlanningBoardMember(member_name, designation);
    res.status(201).json(member);
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ message: "Failed to add member" });
  }
};

export const editPlanningBoard = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { member_name, designation } = req.body;
    const updated = await updatePlanningBoardMember(id, member_name, designation);
    res.json(updated);
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).json({ message: "Failed to update" });
  }
};

export const removePlanningBoard = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deletePlanningBoardMember(id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ message: "Delete failed" });
  }
};

export const reorderPlanning = async (req: Request, res: Response) => {
  try {
    const { orders } = req.body;
    await reorderPlanningBoard(orders);
    res.json({ message: "Reordered successfully" });
  } catch (error) {
    console.error("Error reordering:", error);
    res.status(500).json({ message: "Reorder failed" });
  }
};
