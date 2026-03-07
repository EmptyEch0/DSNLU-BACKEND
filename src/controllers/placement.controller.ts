import { Request, Response } from "express";
import * as placementService from "../services/placement.service";
import { getPlacementPage } from "../services/placement.service";

export const fetchPlacementData = async (req: Request, res: Response) => {
  try {
    const data = await getPlacementPage();
    res.json(data);
  } catch (err) {
    console.error("Error fetching placement data:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateSection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    await placementService.updatePlacementSection(Number(id), description);
    res.json({ message: "Section updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const addMember = async (req: Request, res: Response) => {
  try {
    const memberId = await placementService.addPlacementMember(req.body);
    res.json({ id: memberId, message: "Member added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await placementService.updatePlacementMember(Number(id), req.body);
    res.json({ message: "Member updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await placementService.deletePlacementMember(Number(id));
    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
