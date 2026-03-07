import * as Service from "../services/librarySections.service";
import { Request, Response } from "express";

export const fetchSections = async (_req: Request, res: Response) => {
  try {
    res.json(await Service.getSections());
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch sections" });
  }
};

export const createSection = async (req: Request, res: Response) => {
  try {
    await Service.addSection(req.body.title);
    res.json({ message: "Section added" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to add section" });
  }
};

export const editSection = async (req: Request, res: Response) => {
  try {
    await Service.updateSection(Number(req.params.id), req.body.title);
    res.json({ message: "Section updated" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update section" });
  }
};

export const removeSection = async (req: Request, res: Response) => {
  try {
    await Service.deleteSection(Number(req.params.id));
    res.json({ message: "Section deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete section" });
  }
};

export const createItem = async (req: Request, res: Response) => {
  try {
    await Service.addItem(req.body.section_id, req.body.content);
    res.json({ message: "Item added" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to add item" });
  }
};

export const editItem = async (req: Request, res: Response) => {
  try {
    await Service.updateItem(Number(req.params.id), req.body.content);
    res.json({ message: "Item updated" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update item" });
  }
};

export const removeItem = async (req: Request, res: Response) => {
  try {
    await Service.deleteItem(Number(req.params.id));
    res.json({ message: "Item deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete item" });
  }
};
