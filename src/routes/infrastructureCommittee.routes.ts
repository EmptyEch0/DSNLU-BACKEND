import { Router } from "express";
import {
  fetchInfrastructureCommittee,
  createInfrastructureCommittee,
  editInfrastructureCommittee,
  removeInfrastructureCommittee,
  reorderInfrastructure,
} from "../controllers/infrastructureCommittee.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/infrastructure-committee", fetchInfrastructureCommittee);
router.post("/infrastructure-committee", verifyAdmin, createInfrastructureCommittee);
router.put("/infrastructure-committee/reorder", verifyAdmin, reorderInfrastructure);
router.put("/infrastructure-committee/:id", verifyAdmin, editInfrastructureCommittee);
router.delete("/infrastructure-committee/:id", verifyAdmin, removeInfrastructureCommittee);

export default router;
