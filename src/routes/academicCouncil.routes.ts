import { Router } from "express";
import {
  fetchAcademicCouncil,
  createAcademicCouncil,
  editAcademicCouncil,
  removeAcademicCouncil,
  reorderAcademic,
} from "../controllers/academicCouncil.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/academic-council", fetchAcademicCouncil);
router.post("/academic-council", verifyAdmin, createAcademicCouncil);
router.put("/academic-council/reorder", verifyAdmin, reorderAcademic);
router.put("/academic-council/:id", verifyAdmin, editAcademicCouncil);
router.delete("/academic-council/:id", verifyAdmin, removeAcademicCouncil);

export default router;
