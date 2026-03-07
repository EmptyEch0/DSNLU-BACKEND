import { Router } from "express";
import * as sportsController from "../controllers/sports.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.get("/sports/committee", sportsController.getSportsCommittee);
router.get("/sports/achievements", sportsController.getSportsAchievements);

// Admin: Committee
router.post("/admin/sports/committee", verifyAdmin, sportsController.createCommitteeMember);
router.put("/admin/sports/committee/:id", verifyAdmin, sportsController.updateCommitteeMember);
router.delete("/admin/sports/committee/:id", verifyAdmin, sportsController.deleteCommitteeMember);
router.put("/admin/sports/committee/reorder", verifyAdmin, sportsController.reorderCommittee);

// Admin: Achievements
router.post("/admin/sports/achievement", verifyAdmin, sportsController.createAchievement);
router.put("/admin/sports/achievement/:id", verifyAdmin, sportsController.updateAchievement);
router.delete("/admin/sports/achievement/:id", verifyAdmin, sportsController.deleteAchievement);
router.put("/admin/sports/achievement/reorder", verifyAdmin, sportsController.reorderAchievements);

// Admin: Medal Tally
router.post("/admin/sports/medal", verifyAdmin, sportsController.addMedal);
router.put("/admin/sports/medal/:id", verifyAdmin, sportsController.updateMedal);
router.delete("/admin/sports/medal/:id", verifyAdmin, sportsController.deleteMedal);

// Admin: Timeline
router.post("/admin/sports/timeline", verifyAdmin, sportsController.createTimeline);
router.put("/admin/sports/timeline/:id", verifyAdmin, sportsController.updateTimeline);
router.delete("/admin/sports/timeline/:id", verifyAdmin, sportsController.deleteTimeline);
router.put("/admin/sports/timeline/reorder", verifyAdmin, sportsController.reorderTimeline);

// Public: Contact & Enquiries
router.get("/sports/contact", sportsController.getContactInfo);
router.post("/sports/contact/enquiry", sportsController.createEnquiry);

// Admin: Contact & Enquiries
router.put("/admin/sports/contact/:id", verifyAdmin, sportsController.updateContactInfo);
router.get("/admin/sports/enquiries", verifyAdmin, sportsController.getAllEnquiries);
router.put("/admin/sports/enquiry/:id/status", verifyAdmin, sportsController.updateEnquiryStatus);
router.delete("/admin/sports/enquiry/:id", verifyAdmin, sportsController.deleteEnquiry);

export default router;
