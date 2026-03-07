import * as Service from "../services/libraryResources.service";
import { Request, Response } from "express";

/* ─── E-Books ─── */
export const fetchEBooks = async (_req: Request, res: Response) => {
  try {
    const data = await Service.getEBooks();
    res.set("Cache-Control", "public, max-age=600");
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch e-books" });
  }
};

export const createEBook = async (req: Request, res: Response) => {
  try {
    await Service.addEBook(req.body);
    res.json({ message: "E-Book added" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to add e-book" });
  }
};

export const editEBook = async (req: Request, res: Response) => {
  try {
    await Service.updateEBook(req.params.id as string, req.body);
    res.json({ message: "E-Book updated" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update e-book" });
  }
};

export const removeEBook = async (req: Request, res: Response) => {
  try {
    await Service.deleteEBook(req.params.id as string);
    res.json({ message: "E-Book deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete e-book" });
  }
};

/* ─── E-Databases ─── */
export const fetchEDatabases = async (_req: Request, res: Response) => {
  try {
    const data = await Service.getEDatabases();
    res.set("Cache-Control", "public, max-age=600");
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch e-databases" });
  }
};

export const createEDatabase = async (req: Request, res: Response) => {
  try {
    await Service.addEDatabase(req.body);
    res.json({ message: "E-Database added" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to add e-database" });
  }
};

export const editEDatabase = async (req: Request, res: Response) => {
  try {
    await Service.updateEDatabase(req.params.id as string, req.body);
    res.json({ message: "E-Database updated" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update e-database" });
  }
};

export const removeEDatabase = async (req: Request, res: Response) => {
  try {
    await Service.deleteEDatabase(req.params.id as string);
    res.json({ message: "E-Database deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete e-database" });
  }
};

/* ─── E-Journals ─── */
export const fetchEJournals = async (_req: Request, res: Response) => {
  try {
    const data = await Service.getEJournals();
    res.set("Cache-Control", "public, max-age=600");
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch e-journals" });
  }
};

export const createEJournal = async (req: Request, res: Response) => {
  try {
    await Service.addEJournal(req.body);
    res.json({ message: "E-Journal added" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to add e-journal" });
  }
};

export const editEJournal = async (req: Request, res: Response) => {
  try {
    await Service.updateEJournal(req.params.id as string, req.body);
    res.json({ message: "E-Journal updated" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update e-journal" });
  }
};

export const removeEJournal = async (req: Request, res: Response) => {
  try {
    await Service.deleteEJournal(req.params.id as string);
    res.json({ message: "E-Journal deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete e-journal" });
  }
};
