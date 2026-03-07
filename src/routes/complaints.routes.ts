import express from "express";
import * as ctrl from "../controllers/complaints.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = express.Router();

/* -------- PUBLIC -------- */
router.get("/caste/registrar", ctrl.getRegistrar);
router.get("/caste/members", ctrl.getMembers);
router.post("/caste/submit", ctrl.submitComplaint);
router.get("/ugc", ctrl.getUGC);

/* -------- ADMIN CRUD -------- */
router.post("/caste/registrar", verifyAdmin, ctrl.addRegistrar);
router.put("/caste/registrar/:id", verifyAdmin, ctrl.updateRegistrar);
router.delete("/caste/registrar/:id", verifyAdmin, ctrl.deleteRegistrar);

router.post("/caste/members", verifyAdmin, ctrl.addMember);
router.put("/caste/members/:id", verifyAdmin, ctrl.updateMember);
router.delete("/caste/members/:id", verifyAdmin, ctrl.deleteMember);

router.post("/ugc", verifyAdmin, ctrl.addUGC);
router.put("/ugc/:id", verifyAdmin, ctrl.updateUGC);
router.delete("/ugc/:id", verifyAdmin, ctrl.deleteUGC);

router.get("/caste/submissions", verifyAdmin, ctrl.getSubmissions);
router.delete("/caste/submissions/:id", verifyAdmin, ctrl.deleteSubmission);

export default router;
