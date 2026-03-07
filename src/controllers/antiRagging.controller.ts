import { Request, Response } from "express";
import * as service from "../services/antiRagging.service";

/* ─── Public GETs ─── */
export const getHelpline = async (req: Request, res: Response) => {
  try {
    const data = await service.getHelpline();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAgency = async (req: Request, res: Response) => {
  try {
    const data = await service.getAgency();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getCommittee = async (req: Request, res: Response) => {
  try {
    const data = await service.getCommittee();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getDocuments = async (req: Request, res: Response) => {
  try {
    const data = await service.getDocuments();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/* ─── Committee CRUD ─── */
export const addCommittee = async (req: Request, res: Response) => {
  try {
    await service.addCommittee(req.body);
    res.json({ message: "Committee member added successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCommittee = async (req: Request, res: Response) => {
  try {
    await service.updateCommittee(req.params.id as string, req.body);
    res.json({ message: "Committee member updated successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCommittee = async (req: Request, res: Response) => {
  try {
    await service.deleteCommittee(req.params.id as string);
    res.json({ message: "Committee member deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/* ─── Documents CRUD ─── */
export const addDocument = async (req: Request, res: Response) => {
  try {
    await service.addDocument(req.body);
    res.json({ message: "Document added successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    await service.deleteDocument(req.params.id as string);
    res.json({ message: "Document deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
