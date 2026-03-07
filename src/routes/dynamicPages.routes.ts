import { Router } from "express";
import {
  listPages,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
  addSection,
  updateSection,
  deleteSection,
  listNavAdditions,
  listAllNavAdditions,
  addNavEntry,
  updateNavEntry,
  deleteNavEntry,
} from "../controllers/dynamicPagesController";
import { verifyAdmin } from "../middlewares/verifyAdmin";

const router = Router();

// ── Nav additions (public fetch, admin mutate) ────────────────────────────────
router.get("/nav-additions",       listNavAdditions);
router.get("/nav-additions/all",   verifyAdmin, listAllNavAdditions);
router.post("/nav-additions",      verifyAdmin, addNavEntry);
router.put("/nav-additions/:id",   verifyAdmin, updateNavEntry);
router.delete("/nav-additions/:id",verifyAdmin, deleteNavEntry);

// ── Pages ─────────────────────────────────────────────────────────────────────
router.get("/",         listPages);
router.get("/:slug",    getPageBySlug);
router.post("/",        verifyAdmin, createPage);
router.put("/:id",      verifyAdmin, updatePage);
router.delete("/:id",   verifyAdmin, deletePage);

// ── Sections (nested under a page) ───────────────────────────────────────────
router.post("/:pageId/sections",          verifyAdmin, addSection);
router.put("/sections/:sectionId",        verifyAdmin, updateSection);
router.delete("/sections/:sectionId",     verifyAdmin, deleteSection);

export default router;
