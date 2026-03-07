import { Router } from "express";
import { verifyAdmin } from "../../middlewares/verifyAdmin";
import * as controller from "./centre.committee.admin.controller";

const router = Router();

router.post("/", verifyAdmin, controller.createMember);
router.put("/:id", verifyAdmin, controller.updateMember);
router.delete("/:id", verifyAdmin, controller.deleteMember);
router.put("/reorder", verifyAdmin, controller.reorderMembers);

export default router;
