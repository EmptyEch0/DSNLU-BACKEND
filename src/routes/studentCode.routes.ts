import { Router } from "express";
import { verifyAdmin } from "../middleware/auth.middleware";
import {
  getStudentCode,
  updateSection,
  addSectionItem,
  updateSectionItem,
  deleteSectionItem,
  addProcessStep,
  updateProcessStep,
  deleteProcessStep,
  addPenalty,
  updatePenalty,
  deletePenalty
} from "../controllers/studentCode.controller";

const router = Router();

// Public route
router.get("/student-code", getStudentCode);

// Admin routes
router.put("/admin/student-code/section/:id", verifyAdmin, updateSection);

router.post("/admin/student-code/item", verifyAdmin, addSectionItem);
router.put("/admin/student-code/item/:id", verifyAdmin, updateSectionItem);
router.delete("/admin/student-code/item/:id", verifyAdmin, deleteSectionItem);

router.post("/admin/student-code/step", verifyAdmin, addProcessStep);
router.put("/admin/student-code/step/:id", verifyAdmin, updateProcessStep);
router.delete("/admin/student-code/step/:id", verifyAdmin, deleteProcessStep);

router.post("/admin/student-code/penalty", verifyAdmin, addPenalty);
router.put("/admin/student-code/penalty/:id", verifyAdmin, updatePenalty);
router.delete("/admin/student-code/penalty/:id", verifyAdmin, deletePenalty);

export default router;
