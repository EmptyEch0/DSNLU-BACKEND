import { Router } from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin";
import { getProgramCurriculum } from "../controllers/academic.controller";
import { getLLMCurriculum } from "../controllers/llm.controller";
import {
  createRegulation,
  deleteRegulation,
  createSemester,
  deleteSemester,
  createSubject,
  deleteSubject,
} from "../controllers/academic.admin.controller";

const router = Router();

// Public
router.get("/program/:programCode", getProgramCurriculum);
router.get("/llm/:year", getLLMCurriculum);

// Admin
router.post("/regulation", verifyAdmin, createRegulation);
router.delete("/regulation/:id", verifyAdmin, deleteRegulation);

router.post("/semester", verifyAdmin, createSemester);
router.delete("/semester/:id", verifyAdmin, deleteSemester);

router.post("/subject", verifyAdmin, createSubject);
router.delete("/subject/:id", verifyAdmin, deleteSubject);

export default router;
