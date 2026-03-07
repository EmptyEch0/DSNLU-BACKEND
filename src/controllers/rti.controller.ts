import { Request, Response } from "express";
import {
  getRTIPage,
  updateRTIPage,
  addRTIOfficer,
  updateRTIOfficer,
  deleteRTIOfficer,
  reorderRTIOfficers,
} from "../services/rti.service";

export const fetchRTI = async (req: Request, res: Response) => {
  try {
    const data = await getRTIPage();
    res.status(200).json(data);
  } catch (error) {
    console.error("RTI Fetch Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const editRTIPage = async (req: Request, res: Response) => {
  try {
    const { id, payment_content } = req.body;
    await updateRTIPage(id, payment_content);
    res.json({ message: "Page updated" });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

export const createOfficer = async (req: Request, res: Response) => {
  try {
    const officer = await addRTIOfficer(req.body);
    res.status(201).json(officer);
  } catch (error) {
    res.status(500).json({ message: "Failed to add officer" });
  }
};

export const editOfficer = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await updateRTIOfficer(id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

export const removeOfficer = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteRTIOfficer(id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

export const reorderOfficers = async (req: Request, res: Response) => {
  try {
    const { orders } = req.body;
    await reorderRTIOfficers(orders);
    res.json({ message: "Reordered" });
  } catch (error) {
    res.status(500).json({ message: "Reorder failed" });
  }
};
