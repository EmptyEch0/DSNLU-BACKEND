import { Router } from "express";
import { verifyAdmin } from "../../middlewares/verifyAdmin";
import * as controller from "./centre.admin.controller";

const router = Router();

// ==========================================
// CENTRE INFO
// ==========================================
router.post("/centre", verifyAdmin, controller.createCentre);

// ==========================================
// COMMITTEE
// ==========================================
router.post("/committee", verifyAdmin, controller.createCommitteeMember);
router.put("/committee/:id", verifyAdmin, controller.updateCommitteeMember);
router.delete("/committee/:id", verifyAdmin, controller.deleteCommitteeMember);
router.put("/committee/reorder", verifyAdmin, controller.reorderCommittee);

// ==========================================
// PUBLICATIONS
// ==========================================
router.post("/publication", verifyAdmin, controller.createPublication);
router.put("/publication/:id", verifyAdmin, controller.updatePublication);
router.delete("/publication/:id", verifyAdmin, controller.deletePublication);
router.put("/publication/reorder", verifyAdmin, controller.reorderPublications);

// ==========================================
// EVENTS
// ==========================================
router.post("/event", verifyAdmin, controller.createEvent);
router.put("/event/:id", verifyAdmin, controller.updateEvent);
router.delete("/event/:id", verifyAdmin, controller.deleteEvent);
router.put("/event/reorder", verifyAdmin, controller.reorderEvents);

// ==========================================
// GALLERY
// ==========================================
router.post("/gallery", verifyAdmin, controller.createGalleryImage);
router.put("/gallery/:id", verifyAdmin, controller.updateGalleryImage);
router.delete("/gallery/:id", verifyAdmin, controller.deleteGalleryImage);
router.put("/gallery/reorder", verifyAdmin, controller.reorderGallery);

export default router;
