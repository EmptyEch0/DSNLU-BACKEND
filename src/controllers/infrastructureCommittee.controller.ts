import { Request, Response } from "express";
import {
  getInfrastructureCommitteeMembers,
  addInfrastructureCommitteeMember,
  updateInfrastructureCommitteeMember,
  deleteInfrastructureCommitteeMember,
  reorderInfrastructureCommittee,
} from "../services/infrastructureCommittee.service";

export const fetchInfrastructureCommittee = async (req: Request, res: Response) => {
  try {
    const members = await getInfrastructureCommitteeMembers();
    res.status(200).json(members);
  } catch (error) {
    console.error("Infrastructure Committee Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createInfrastructureCommittee = async (req: Request, res: Response) => {
  try {
    const { member_name, designation } = req.body;
    const member = await addInfrastructureCommitteeMember(member_name, designation);
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: "Failed to add member" });
  }
};

export const editInfrastructureCommittee = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { member_name, designation } = req.body;
    const updated = await updateInfrastructureCommitteeMember(id, member_name, designation);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update" });
  }
};

export const removeInfrastructureCommittee = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteInfrastructureCommitteeMember(id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

export const reorderInfrastructure = async (req: Request, res: Response) => {
  try {
    const { orders } = req.body;
    await reorderInfrastructureCommittee(orders);
    res.json({ message: "Reordered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Reorder failed" });
  }
};
