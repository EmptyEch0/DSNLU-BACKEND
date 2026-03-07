import { Request, Response } from "express";
import {
  getCampusLife,
  addCampusLife,
  updateCampusLife,
  deleteCampusLife,
  reorderCampusLife,
} from "../services/campusLife.service";

export const fetchCampusLife = async (req: Request, res: Response) => {
  try {
    const data = await getCampusLife();
    res.status(200).json(data);
  } catch (error) {
    console.error("Campus Life Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createCampusLife = async (req: Request, res: Response) => {
  try {
    const item = await addCampusLife(req.body);
    res.status(201).json(item);
  } catch (error) {
    console.error("Error adding campus life:", error);
    res.status(500).json({ message: "Creation failed" });
  }
};

export const editCampusLife = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await updateCampusLife(id, req.body);
    res.json(updated);
  } catch (error) {
    console.error("Error updating campus life:", error);
    res.status(500).json({ message: "Failed to update" });
  }
};

export const removeCampusLife = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteCampusLife(id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

export const reorderCampus = async (req: Request, res: Response) => {
  try {
    const { orders } = req.body;
    await reorderCampusLife(orders);
    res.json({ message: "Reordered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Reorder failed" });
  }
};
