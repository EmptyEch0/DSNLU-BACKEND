import { Router } from "express";
import { verifyAdmin } from "../../middlewares/verifyAdmin";
import * as controller from "./cipr.board.admin.controller";

const router = Router();

router.get("/board", controller.getBoard);

router.post("/board", verifyAdmin, controller.createMember);
router.put("/board/:id", verifyAdmin, controller.updateMember);
router.delete("/board/:id", verifyAdmin, controller.deleteMember);

export default router;
