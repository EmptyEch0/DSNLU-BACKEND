import { Router } from "express";
import {
  fetchRTI,
  editRTIPage,
  createOfficer,
  editOfficer,
  removeOfficer,
  reorderOfficers,
} from "../controllers/rti.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", fetchRTI);
router.put("/page", verifyAdmin, editRTIPage);
router.post("/officer", verifyAdmin, createOfficer);
router.put("/officer/reorder", verifyAdmin, reorderOfficers);
router.put("/officer/:id", verifyAdmin, editOfficer);
router.delete("/officer/:id", verifyAdmin, removeOfficer);

export default router;
