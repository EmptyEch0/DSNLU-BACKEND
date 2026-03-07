import { Request, Response } from "express";
import {
  getEmeritusList,
  getEmeritusBySlug,
  addEmeritus,
  updateEmeritus,
  deleteEmeritus,
  reorderEmeritus,
} from "../services/professorEmeritus.service";

export const fetchEmeritusList = async (req: Request, res: Response) => {
  try {
    const data = await getEmeritusList();
    res.status(200).json(data);
  } catch (error) {
    console.error("Professor Emeritus List Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const fetchEmeritusDetail = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const data = await getEmeritusBySlug(slug);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  } catch (error) {
    console.error("Professor Emeritus Detail Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createEmeritus = async (req: Request, res: Response) => {
  try {
    const item = await addEmeritus(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Creation failed" });
  }
};

export const editEmeritus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await updateEmeritus(id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

export const removeEmeritus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteEmeritus(id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

export const reorderEmeritusController = async (req: Request, res: Response) => {
  try {
    const { orders } = req.body;
    await reorderEmeritus(orders);
    res.json({ message: "Reordered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Reorder failed" });
  }
};
