import { Router } from "express";
import {
  fetchPlanningBoard,
  createPlanningBoard,
  editPlanningBoard,
  removePlanningBoard,
  reorderPlanning,
} from "../controllers/planningBoard.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/planning-board", fetchPlanningBoard);
router.post("/planning-board", verifyAdmin, createPlanningBoard);
router.put("/planning-board/reorder", verifyAdmin, reorderPlanning);
router.put("/planning-board/:id", verifyAdmin, editPlanningBoard);
router.delete("/planning-board/:id", verifyAdmin, removePlanningBoard);

export default router;
