import { Router } from "express";
import {
  getCurrentVC,
  getFormerVCs,
  updateCurrentVC,
  createVC,
  deleteVC
} from "../controllers/vc.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = Router();

// PUBLIC ROUTES
router.get("/current", getCurrentVC);
router.get("/former", getFormerVCs);

// ADMIN ROUTES
router.post("/", verifyAdmin, createVC);
router.put("/current", verifyAdmin, updateCurrentVC); // Added for modal compatibility
router.put("/:id", verifyAdmin, updateCurrentVC);
router.delete("/:id", verifyAdmin, deleteVC);

export default router;
