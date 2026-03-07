import express from "express";
import { getCurriculum } from "../controllers/curriculum.controller";
import { verifyAdmin } from "../middlewares/verifyAdmin";
import * as admin from "../controllers/curriculum.admin.controller";

const router = express.Router();

router.get("/", getCurriculum);
router.get("/program/BALLB", getCurriculum);
router.get("/program/LLM", getCurriculum);

// ADMIN CRUD
router.post("/year", verifyAdmin, admin.createYear);
router.put("/year/:id", verifyAdmin, admin.updateYear);
router.delete("/year/:id", verifyAdmin, admin.deleteYear);

router.post("/semester", verifyAdmin, admin.createSemester);
router.put("/semester/:id", verifyAdmin, admin.updateSemester);
router.delete("/semester/:id", verifyAdmin, admin.deleteSemester);

router.post("/subject", verifyAdmin, admin.createSubject);
router.put("/subject/:id", verifyAdmin, admin.updateSubject);
router.delete("/subject/:id", verifyAdmin, admin.deleteSubject);

export default router;
