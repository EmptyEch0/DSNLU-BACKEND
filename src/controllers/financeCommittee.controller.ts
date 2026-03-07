import { Request, Response } from "express";
import {
  getFinanceCommitteeMembers,
  addFinanceCommitteeMember,
  updateFinanceCommitteeMember,
  deleteFinanceCommitteeMember,
  reorderFinanceCommittee,
} from "../services/financeCommittee.service";

export const fetchFinanceCommittee = async (req: Request, res: Response) => {
  try {
    const members = await getFinanceCommitteeMembers();
    res.status(200).json(members);
  } catch (error) {
    console.error("Finance Committee Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createFinanceCommittee = async (req: Request, res: Response) => {
  try {
    const { member_name, designation } = req.body;
    const member = await addFinanceCommitteeMember(member_name, designation);
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: "Failed to add member" });
  }
};

export const editFinanceCommittee = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { member_name, designation } = req.body;
    const updated = await updateFinanceCommitteeMember(id, member_name, designation);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update" });
  }
};

export const removeFinanceCommittee = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteFinanceCommitteeMember(id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

export const reorderFinance = async (req: Request, res: Response) => {
  try {
    const { orders } = req.body;
    await reorderFinanceCommittee(orders);
    res.json({ message: "Reordered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Reorder failed" });
  }
};
