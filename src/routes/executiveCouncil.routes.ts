import { Router } from "express";
import {
  fetchExecutiveCouncil,
  createExecutiveCouncil,
  editExecutiveCouncil,
  removeExecutiveCouncil,
  reorderExecutive,
} from "../controllers/executiveCouncil.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/executive-council", fetchExecutiveCouncil);
router.post("/executive-council", verifyAdmin, createExecutiveCouncil);
router.put("/executive-council/reorder", verifyAdmin, reorderExecutive);
router.put("/executive-council/:id", verifyAdmin, editExecutiveCouncil);
router.delete("/executive-council/:id", verifyAdmin, removeExecutiveCouncil);

export default router;
