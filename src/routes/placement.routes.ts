import { Router } from "express";
import { 
  fetchPlacementData, 
  updateSection, 
  addMember, 
  updateMember, 
  deleteMember 
} from "../controllers/placement.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = Router();

// Public Routes
router.get("/placement", fetchPlacementData);

// Admin Routes
router.put("/admin/placement/section/:id", verifyAdmin, updateSection);
router.post("/admin/placement/member", verifyAdmin, addMember);
router.put("/admin/placement/member/:id", verifyAdmin, updateMember);
router.delete("/admin/placement/member/:id", verifyAdmin, deleteMember);

export default router;
