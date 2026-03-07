import express from "express";
import { 
  getSCSTCommittee, 
  addMember, 
  updateMember, 
  deleteMember,
  addResponsibility,
  updateResponsibility,
  deleteResponsibility,
  getSCSTGrievance,
  addGrievanceContact,
  updateGrievanceContact,
  deleteGrievanceContact,
  submitComplaint,
  getComplaints,
  updateComplaintStatus
} from "../controllers/scst.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = express.Router();

// --- Public Routes ---
router.get("/scst/committee", getSCSTCommittee);
router.get("/scst/grievance", getSCSTGrievance);
router.post("/scst/complaint", submitComplaint);

// --- Admin Routes ---

// SCST Committee Members
router.post("/admin/scst/member", verifyAdmin, addMember);
router.put("/admin/scst/member/:id", verifyAdmin, updateMember);
router.delete("/admin/scst/member/:id", verifyAdmin, deleteMember);

// SCST Committee Responsibilities
router.post("/admin/scst/responsibility", verifyAdmin, addResponsibility);
router.put("/admin/scst/responsibility/:id", verifyAdmin, updateResponsibility);
router.delete("/admin/scst/responsibility/:id", verifyAdmin, deleteResponsibility);

// SCST Grievance Contacts
router.post("/admin/scst/contact", verifyAdmin, addGrievanceContact);
router.put("/admin/scst/contact/:id", verifyAdmin, updateGrievanceContact);
router.delete("/admin/scst/contact/:id", verifyAdmin, deleteGrievanceContact);

// Complaints Management
router.get("/admin/scst/complaints", verifyAdmin, getComplaints);
router.put("/admin/scst/complaint/:id", verifyAdmin, updateComplaintStatus);

export default router;
