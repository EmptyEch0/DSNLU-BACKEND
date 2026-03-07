import express from "express";
import { 
  getAllResults, 
  getResultBySlug, 
  addExamResult, 
  updateExamResult, 
  deleteExamResult,
  addResultFile,
  updateResultFile,
  deleteResultFile
} from "../controllers/exam.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = express.Router();

// Public routes
router.get("/", getAllResults);
router.get("/:slug", getResultBySlug);

// Admin routes
router.post("/exam-result", verifyAdmin, addExamResult);
router.put("/exam-result/:id", verifyAdmin, updateExamResult);
router.delete("/exam-result/:id", verifyAdmin, deleteExamResult);

// Internal File CRUD
router.post("/exam-file", verifyAdmin, addResultFile);
router.put("/exam-file/:id", verifyAdmin, updateResultFile);
router.delete("/exam-file/:id", verifyAdmin, deleteResultFile);

export default router;
