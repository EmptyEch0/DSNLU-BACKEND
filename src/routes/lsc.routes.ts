import { Router } from "express";
import * as lscController from "../controllers/lsc.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.get("/lsc/members", lscController.getLSCMembers);
router.get("/lsc/contact", lscController.getLSCContact);
router.post("/lsc/enquiry", lscController.createEnquiry);

// Admin routes
router.post("/admin/lsc/member", verifyAdmin, lscController.createMember);
router.put("/admin/lsc/member/:id", verifyAdmin, lscController.updateMember);
router.delete("/admin/lsc/member/:id", verifyAdmin, lscController.deleteMember);

router.put("/admin/lsc/contact/:id", verifyAdmin, lscController.updateContact);

export default router;
