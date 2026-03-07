import * as Service from "../services/library.service";
import { Request, Response } from "express";

// ===== TEAM =====

export const fetchTeam = async (_req: Request, res: Response) => {
  try {
    res.json(await Service.getTeam());
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch team" });
  }
};

export const createTeam = async (req: Request, res: Response) => {
  try {
    await Service.addTeam(req.body);
    res.json({ message: "Team member added" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to add team member" });
  }
};

export const editTeam = async (req: Request, res: Response) => {
  try {
    await Service.updateTeam(Number(req.params.id), req.body);
    res.json({ message: "Team member updated" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update team member" });
  }
};

export const removeTeam = async (req: Request, res: Response) => {
  try {
    await Service.deleteTeam(Number(req.params.id));
    res.json({ message: "Team member deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete team member" });
  }
};

// ===== COMMITTEE =====

export const fetchCommittee = async (_req: Request, res: Response) => {
  try {
    res.json(await Service.getCommittee());
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch committee" });
  }
};

export const createCommittee = async (req: Request, res: Response) => {
  try {
    await Service.addCommittee(req.body);
    res.json({ message: "Committee member added" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to add committee member" });
  }
};

export const editCommittee = async (req: Request, res: Response) => {
  try {
    await Service.updateCommittee(Number(req.params.id), req.body);
    res.json({ message: "Committee member updated" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update committee member" });
  }
};

export const removeCommittee = async (req: Request, res: Response) => {
  try {
    await Service.deleteCommittee(Number(req.params.id));
    res.json({ message: "Committee member deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete committee member" });
  }
};

// ===== TIMINGS =====

export const fetchTimings = async (_req: Request, res: Response) => {
  try {
    res.json(await Service.getTimings());
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch library timings" });
  }
};

export const createTiming = async (req: Request, res: Response) => {
  try {
    await Service.addTiming(req.body);
    res.json({ message: "Timing added" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to add timing" });
  }
};

export const editTiming = async (req: Request, res: Response) => {
  try {
    await Service.updateTiming(Number(req.params.id), req.body);
    res.json({ message: "Timing updated" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update timing" });
  }
};

export const removeTiming = async (req: Request, res: Response) => {
  try {
    await Service.deleteTiming(Number(req.params.id));
    res.json({ message: "Timing deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete timing" });
  }
};
