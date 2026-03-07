import { Request, Response } from "express";
import * as svc from "../services/journal.service";

// --- FULL JOURNAL (single endpoint) ---
export const fetchFullJournal = async (_req: Request, res: Response) => {
  try { res.json(await svc.getFullJournal()); } catch (e: any) { console.error("FULL JOURNAL ERROR:", e); res.status(500).json({ error: e.message }); }
};


// --- ABOUT ---
export const fetchAbout = async (_req: Request, res: Response) => {
  try { res.json(await svc.getAbout()); } catch (e: any) { console.error("ABOUT ERROR:", e); res.status(500).json({ error: e.message }); }
};
export const editAbout = async (req: Request, res: Response) => {
  try { await svc.updateAbout(req.body.content); res.json({ message: "Updated" }); } catch (e: any) { console.error("ABOUT UPDATE ERROR:", e); res.status(500).json({ error: e.message }); }
};

// --- CONTACTS ---
export const fetchContacts = async (_req: Request, res: Response) => {
  try { res.json(await svc.getContacts()); } catch (e: any) { console.error("CONTACTS ERROR:", e); res.status(500).json({ error: e.message }); }
};
export const createContact = async (req: Request, res: Response) => {
  try { res.status(201).json(await svc.addContact(req.body)); } catch (e: any) { console.error("CONTACT CREATE ERROR:", e); res.status(500).json({ error: e.message }); }
};
export const editContact = async (req: Request, res: Response) => {
  try { await svc.updateContact(Number(req.params.id), req.body); res.json({ message: "Updated" }); } catch (e: any) { console.error("CONTACT UPDATE ERROR:", e); res.status(500).json({ error: e.message }); }
};
export const removeContact = async (req: Request, res: Response) => {
  try { await svc.deleteContact(Number(req.params.id)); res.json({ message: "Deleted" }); } catch (e: any) { console.error("CONTACT DELETE ERROR:", e); res.status(500).json({ error: e.message }); }
};

// --- GUIDELINES ---
export const fetchGuidelines = async (_req: Request, res: Response) => {
  try { res.json(await svc.getGuidelines()); } catch (e: any) { console.error("GUIDELINE ERROR:", e); res.status(500).json({ error: e.message }); }
};
export const createGuideline = async (req: Request, res: Response) => {
  try { res.status(201).json(await svc.addGuideline(req.body)); } catch (e: any) { console.error("GUIDELINE CREATE ERROR:", e); res.status(500).json({ error: e.message }); }
};
export const editGuideline = async (req: Request, res: Response) => {
  try { await svc.updateGuideline(Number(req.params.id), req.body); res.json({ message: "Updated" }); } catch (e: any) { console.error("GUIDELINE UPDATE ERROR:", e); res.status(500).json({ error: e.message }); }
};
export const removeGuideline = async (req: Request, res: Response) => {
  try { await svc.deleteGuideline(Number(req.params.id)); res.json({ message: "Deleted" }); } catch (e: any) { console.error("GUIDELINE DELETE ERROR:", e); res.status(500).json({ error: e.message }); }
};

// --- WORD LIMITS ---
export const fetchWordLimits = async (_req: Request, res: Response) => {
  try { res.json(await svc.getWordLimits()); } catch (e: any) { console.error("WORD LIMITS ERROR:", e); res.status(500).json({ error: e.message }); }
};
export const createWordLimit = async (req: Request, res: Response) => {
  try { res.status(201).json(await svc.addWordLimit(req.body)); } catch (e: any) { console.error("WORD LIMIT CREATE ERROR:", e); res.status(500).json({ error: e.message }); }
};
export const editWordLimit = async (req: Request, res: Response) => {
  try { await svc.updateWordLimit(Number(req.params.id), req.body); res.json({ message: "Updated" }); } catch (e: any) { console.error("WORD LIMIT UPDATE ERROR:", e); res.status(500).json({ error: e.message }); }
};
export const removeWordLimit = async (req: Request, res: Response) => {
  try { await svc.deleteWordLimit(Number(req.params.id)); res.json({ message: "Deleted" }); } catch (e: any) { console.error("WORD LIMIT DELETE ERROR:", e); res.status(500).json({ error: e.message }); }
};

// --- BOARD ---
export const fetchBoard = async (_req: Request, res: Response) => {
  try { res.json(await svc.getBoard()); } catch (e: any) { console.error("BOARD ERROR:", e); res.status(500).json({ error: e.message }); }
};
export const createBoardMember = async (req: Request, res: Response) => {
  try { res.status(201).json(await svc.addBoardMember(req.body)); } catch (e: any) { console.error("BOARD CREATE ERROR:", e); res.status(500).json({ error: e.message }); }
};
export const editBoardMember = async (req: Request, res: Response) => {
  try { await svc.updateBoardMember(Number(req.params.id), req.body); res.json({ message: "Updated" }); } catch (e: any) { console.error("BOARD UPDATE ERROR:", e); res.status(500).json({ error: e.message }); }
};
export const removeBoardMember = async (req: Request, res: Response) => {
  try { await svc.deleteBoardMember(Number(req.params.id)); res.json({ message: "Deleted" }); } catch (e: any) { console.error("BOARD DELETE ERROR:", e); res.status(500).json({ error: e.message }); }
};

// --- ARCHIVES ---
export const fetchArchives = async (_req: Request, res: Response) => {
  try { res.json(await svc.getArchives()); } catch (e: any) { console.error("ARCHIVES ERROR:", e); res.status(500).json({ error: e.message }); }
};
export const createArchive = async (req: Request, res: Response) => {
  try { res.status(201).json(await svc.addArchive(req.body)); } catch (e: any) { console.error("ARCHIVE CREATE ERROR:", e); res.status(500).json({ error: e.message }); }
};
export const editArchive = async (req: Request, res: Response) => {
  try { await svc.updateArchive(Number(req.params.id), req.body); res.json({ message: "Updated" }); } catch (e: any) { console.error("ARCHIVE UPDATE ERROR:", e); res.status(500).json({ error: e.message }); }
};
export const removeArchive = async (req: Request, res: Response) => {
  try { await svc.deleteArchive(Number(req.params.id)); res.json({ message: "Deleted" }); } catch (e: any) { console.error("ARCHIVE DELETE ERROR:", e); res.status(500).json({ error: e.message }); }
};
