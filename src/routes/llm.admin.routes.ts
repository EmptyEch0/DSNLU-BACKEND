import express from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin";
import * as admin from "../controllers/llm.admin.controller";

const router = express.Router();

// Regulation
router.post("/regulation", verifyAdmin, admin.createRegulation);
router.put("/regulation/:id", verifyAdmin, admin.updateRegulation);
router.delete("/regulation/:id", verifyAdmin, admin.deleteRegulation);

// Compulsory Papers
router.post("/compulsory", verifyAdmin, admin.createCompulsoryPaper);
router.put("/compulsory/:id", verifyAdmin, admin.updateCompulsoryPaper);
router.delete("/compulsory/:id", verifyAdmin, admin.deleteCompulsoryPaper);

// Dissertation
router.put("/dissertation/:id", verifyAdmin, admin.updateDissertation);

// Specializations
router.post("/specialization", verifyAdmin, admin.createSpecialization);
router.put("/specialization/:id", verifyAdmin, admin.updateSpecialization);
router.delete("/specialization/:id", verifyAdmin, admin.deleteSpecialization);

// Specialization Papers
router.post("/specialization-paper", verifyAdmin, admin.createSpecializationPaper);
router.put("/specialization-paper/:id", verifyAdmin, admin.updateSpecializationPaper);
router.delete("/specialization-paper/:id", verifyAdmin, admin.deleteSpecializationPaper);

export default router;
