import { Router } from "express";
import { verifyAdmin } from "../../middlewares/verifyAdmin";
import {
  getCentreBySlug,
  getCentreFull,
  createCentre,
  addCommitteeMember,
  updateCommitteeMember,
  deleteCommitteeMember,
  addPublication,
  updatePublication,
  deletePublication,
  addEvent,
  updateEvent,
  deleteEvent,
  addGalleryItem,
  deleteGalleryItem,
  reorderItems,
  getCentreResearch,
  getLICCommittee,
  getCentreEvents,
  getCIPRBoard,
} from "./centre.controller";

const router = Router();

// Public
router.get("/lic/committee", getLICCommittee);
router.get("/cipr/board", getCIPRBoard);
router.get("/:centreId/events", getCentreEvents);
router.get("/:slug", getCentreBySlug);
router.get("/:slug/full", getCentreFull);
router.get("/:centreSlug/research", getCentreResearch);

// Admin - Publications
router.delete("/publication/:id", verifyAdmin, deletePublication);

// Admin - Events
router.post("/event", verifyAdmin, addEvent);
router.put("/event/:id", verifyAdmin, updateEvent);
router.delete("/event/:id", verifyAdmin, deleteEvent);

// Admin - Gallery
router.post("/gallery", verifyAdmin, addGalleryItem);
router.delete("/gallery/:id", verifyAdmin, deleteGalleryItem);

// Reorder
router.put("/reorder", verifyAdmin, reorderItems);

// Generic CMS Routes for Generic Centres (Environment, Public Policy)
import * as contentController from "./centre.content.admin.controller";

router.get("/:centreId/content", contentController.getCentreContent);
router.get("/:centreId/committee", contentController.getCommittee);
router.get("/:centreId/brochure", contentController.getBrochure);

router.post("/admin/committee", verifyAdmin, contentController.createCommittee);
router.put("/admin/committee/:id", verifyAdmin, contentController.updateCommittee);
router.delete("/admin/committee/:id", verifyAdmin, contentController.deleteCommittee);
router.patch("/admin/committee/reorder", verifyAdmin, contentController.reorderCommittee);

router.put("/admin/content/:id", verifyAdmin, contentController.updateContent);
router.post("/admin/brochure", verifyAdmin, contentController.createBrochure);
router.put("/admin/brochure/:id", verifyAdmin, contentController.updateBrochure);

// Student Teams
router.get("/:id/student-teams", contentController.getStudentTeams);
router.post("/admin/team-group", verifyAdmin, contentController.createTeamGroup);
router.put("/admin/team-group/:id", verifyAdmin, contentController.updateTeamGroup);
router.delete("/admin/team-group/:id", verifyAdmin, contentController.deleteTeamGroup);
router.patch("/admin/team-group/reorder", verifyAdmin, contentController.reorderTeamGroup);

router.post("/admin/team-member", verifyAdmin, contentController.createTeamMember);
router.put("/admin/team-member/:id", verifyAdmin, contentController.updateTeamMember);
router.delete("/admin/team-member/:id", verifyAdmin, contentController.deleteTeamMember);
router.patch("/admin/team-member/reorder", verifyAdmin, contentController.reorderTeamMember);

export default router;
