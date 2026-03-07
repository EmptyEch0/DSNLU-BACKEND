import { Router } from "express";
import * as iccController from "../controllers/icc.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.get("/icc/members", iccController.getICCMembers);

// Admin routes
router.post("/admin/icc/member", verifyAdmin, iccController.createICCMember);
router.put("/admin/icc/member/:id", verifyAdmin, iccController.updateICCMember);
router.delete("/admin/icc/member/:id", verifyAdmin, iccController.deleteICCMember);

export default router;
