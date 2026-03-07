import { Router } from "express";
import {
  fetchCampusLife,
  createCampusLife,
  editCampusLife,
  removeCampusLife,
  reorderCampus,
} from "../controllers/campusLife.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/campus-life", fetchCampusLife);
router.post("/campus-life", verifyAdmin, createCampusLife);
router.put("/campus-life/reorder", verifyAdmin, reorderCampus);
router.put("/campus-life/:id", verifyAdmin, editCampusLife);
router.delete("/campus-life/:id", verifyAdmin, removeCampusLife);

export default router;
