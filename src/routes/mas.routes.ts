import { Router } from "express";
import * as masController from "../controllers/mas.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = Router();

// Public: Get all MAS data
router.get("/mas", masController.getMASData);

// Admin: Faculty
router.post("/admin/mas/faculty", verifyAdmin, masController.createFaculty);
router.put("/admin/mas/faculty/:id", verifyAdmin, masController.updateFaculty);
router.delete("/admin/mas/faculty/:id", verifyAdmin, masController.deleteFaculty);

// Admin: Office Bearers
router.post("/admin/mas/ob", verifyAdmin, masController.createOfficeBearer);
router.put("/admin/mas/ob/:id", verifyAdmin, masController.updateOfficeBearer);
router.delete("/admin/mas/ob/:id", verifyAdmin, masController.deleteOfficeBearer);

// Admin: Member Groups
router.post("/admin/mas/group", verifyAdmin, masController.createGroup);
router.put("/admin/mas/group/:id", verifyAdmin, masController.updateGroup);
router.delete("/admin/mas/group/:id", verifyAdmin, masController.deleteGroup);

// Admin: Members
router.post("/admin/mas/member", verifyAdmin, masController.createMember);
router.put("/admin/mas/member/:id", verifyAdmin, masController.updateMember);
router.delete("/admin/mas/member/:id", verifyAdmin, masController.deleteMember);

// Admin: Achievement Batches
router.post("/admin/mas/achievement-batch", verifyAdmin, masController.createAchievementBatch);
router.put("/admin/mas/achievement-batch/:id", verifyAdmin, masController.updateAchievementBatch);
router.delete("/admin/mas/achievement-batch/:id", verifyAdmin, masController.deleteAchievementBatch);

// Admin: Achievement Items
router.post("/admin/mas/achievement-item", verifyAdmin, masController.createAchievementItem);
router.put("/admin/mas/achievement-item/:id", verifyAdmin, masController.updateAchievementItem);
router.delete("/admin/mas/achievement-item/:id", verifyAdmin, masController.deleteAchievementItem);

// Reordering
router.put("/admin/mas/reorder", verifyAdmin, masController.reorderMAS);

export default router;
