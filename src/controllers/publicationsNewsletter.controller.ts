import { Request, Response } from "express";
import {
  getAllNewsletters,
  getNewsletterBySlug,
  addNewsletter,
  updateNewsletter,
  deleteNewsletter,
  reorderNewsletters,
} from "../services/publicationsNewsletter.service";

export const fetchAllNewsletters = async (req: Request, res: Response) => {
  try {
    const data = await getAllNewsletters();
    res.status(200).json(data);
  } catch (error) {
    console.error("Newsletter Fetch Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const fetchNewsletterBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const data = await getNewsletterBySlug(slug);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  } catch (error) {
    console.error("Newsletter Detail Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createNewsletter = async (req: Request, res: Response) => {
  try {
    const item = await addNewsletter(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to add newsletter" });
  }
};

export const editNewsletter = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await updateNewsletter(id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

export const removeNewsletter = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteNewsletter(id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

export const reorderNewslettersController = async (req: Request, res: Response) => {
  try {
    const { orders } = req.body;
    await reorderNewsletters(orders);
    res.json({ message: "Reordered" });
  } catch (error) {
    res.status(500).json({ message: "Reorder failed" });
  }
};
