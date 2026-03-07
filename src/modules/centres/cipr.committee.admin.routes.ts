import { Router } from "express";
import { verifyAdmin } from "../../middlewares/verifyAdmin";
import * as controller from "./cipr.committee.admin.controller";

const router = Router();

router.get("/committee", controller.getCommittee);

router.post("/committee", verifyAdmin, controller.createMember);
router.put("/committee/:id", verifyAdmin, controller.updateMember);
router.delete("/committee/:id", verifyAdmin, controller.deleteMember);

export default router;
