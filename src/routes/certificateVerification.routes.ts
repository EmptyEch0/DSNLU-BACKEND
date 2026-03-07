import express from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin";
import {
  getProgrammes,
  getBatchStudents,
  createProgramme,
  createBatch,
  deleteBatch,
  createStudent,
  deleteStudent,
  bulkImportStudents,
} from "../controllers/certificateVerification.controller";

const router = express.Router();

// Public
router.get("/programmes", getProgrammes);
router.get("/batch/:batchId/students", getBatchStudents);

// Admin
router.post("/programme", verifyAdmin, createProgramme);
router.post("/batch", verifyAdmin, createBatch);
router.delete("/batch/:id", verifyAdmin, deleteBatch);
router.post("/student", verifyAdmin, createStudent);
router.delete("/student/:id", verifyAdmin, deleteStudent);
router.post("/batch/:batchId/bulk-import", verifyAdmin, bulkImportStudents);

export default router;
