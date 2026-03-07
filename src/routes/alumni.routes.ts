import { Router } from "express";
import * as alumniController from "../controllers/alumni.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.get("/alumni", alumniController.getAlumniPage);

// Admin routes
router.put("/admin/alumni/page", verifyAdmin, alumniController.updateAlumniPageInfo);

router.post("/admin/alumni/member", verifyAdmin, alumniController.createAlumniMember);
router.put("/admin/alumni/member/:id", verifyAdmin, alumniController.updateAlumniMember);
router.delete("/admin/alumni/member/:id", verifyAdmin, alumniController.deleteAlumniMember);

router.post("/admin/alumni/event", verifyAdmin, alumniController.createAlumniEvent);
router.put("/admin/alumni/event/:id", verifyAdmin, alumniController.updateAlumniEvent);
router.delete("/admin/alumni/event/:id", verifyAdmin, alumniController.deleteAlumniEvent);

router.post("/admin/alumni/highlight", verifyAdmin, alumniController.createAlumniHighlight);
router.put("/admin/alumni/highlight/:id", verifyAdmin, alumniController.updateAlumniHighlight);
router.delete("/admin/alumni/highlight/:id", verifyAdmin, alumniController.deleteAlumniHighlight);

router.post("/admin/alumni/gallery", verifyAdmin, alumniController.createAlumniGallery);
router.put("/admin/alumni/gallery/:id", verifyAdmin, alumniController.updateAlumniGallery);
router.delete("/admin/alumni/gallery/:id", verifyAdmin, alumniController.deleteAlumniGallery);

export default router;
