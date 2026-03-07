import express from "express";
import * as ctrl from "../controllers/antiRagging.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = express.Router();

/* Public */
router.get("/helpline", ctrl.getHelpline);
router.get("/agency", ctrl.getAgency);
router.get("/committee", ctrl.getCommittee);
router.get("/documents", ctrl.getDocuments);

/* Admin CRUD */
router.post("/committee", verifyAdmin, ctrl.addCommittee);
router.put("/committee/:id", verifyAdmin, ctrl.updateCommittee);
router.delete("/committee/:id", verifyAdmin, ctrl.deleteCommittee);

router.post("/documents", verifyAdmin, ctrl.addDocument);
router.delete("/documents/:id", verifyAdmin, ctrl.deleteDocument);

export default router;
