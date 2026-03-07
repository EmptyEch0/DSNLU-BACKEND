import { Router } from "express";
import {
  getArchives,
  createArchive,
  updateArchive,
  deleteArchive,
} from "../controllers/archives.controller";
import { verifyAdmin } from "../middlewares/verifyAdmin";

const router = Router();

// Public
router.get("/", getArchives);

// Admin-protected
router.post("/",       verifyAdmin, createArchive);
router.put("/:id",    verifyAdmin, updateArchive);
router.delete("/:id", verifyAdmin, deleteArchive);

export default router;
