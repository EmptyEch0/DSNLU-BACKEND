import { Request, Response } from "express";
import * as service from "../services/complaints.service";

// ─── Registrar ───
export const getRegistrar = async (req: Request, res: Response) => {
  try {
    const data = await service.getRegistrar();
    res.json((data as any)[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const addRegistrar = async (req: Request, res: Response) => {
  try {
    await service.addRegistrar(req.body);
    res.json({ message: "Registrar added successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateRegistrar = async (req: Request, res: Response) => {
  try {
    await service.updateRegistrar(req.params.id as string, req.body);
    res.json({ message: "Registrar updated successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteRegistrar = async (req: Request, res: Response) => {
  try {
    await service.deleteRegistrar(req.params.id as string);
    res.json({ message: "Registrar deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Members ───
export const getMembers = async (req: Request, res: Response) => {
  try {
    const data = await service.getMembers();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const addMember = async (req: Request, res: Response) => {
  try {
    await service.addMember(req.body);
    res.json({ message: "Member added successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMember = async (req: Request, res: Response) => {
  try {
    await service.updateMember(req.params.id as string, req.body);
    res.json({ message: "Member updated successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  try {
    await service.deleteMember(req.params.id as string);
    res.json({ message: "Member deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Complaint Submissions ───
export const submitComplaint = async (req: Request, res: Response) => {
  try {
    await service.submitComplaint(req.body);
    res.json({ message: "Complaint submitted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getSubmissions = async (req: Request, res: Response) => {
  try {
    const data = await service.getSubmissions();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteSubmission = async (req: Request, res: Response) => {
  try {
    await service.deleteSubmission(req.params.id as string);
    res.json({ message: "Submission deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ─── UGC ───
export const getUGC = async (req: Request, res: Response) => {
  try {
    const data = await service.getUGC();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const addUGC = async (req: Request, res: Response) => {
  try {
    await service.addUGC(req.body);
    res.json({ message: "UGC entry added successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUGC = async (req: Request, res: Response) => {
  try {
    await service.updateUGC(req.params.id as string, req.body);
    res.json({ message: "UGC entry updated successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUGC = async (req: Request, res: Response) => {
  try {
    await service.deleteUGC(req.params.id as string);
    res.json({ message: "UGC entry deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
