import { Router } from "express";
import { verifyAdmin } from "../../middlewares/verifyAdmin";
import * as controller from "./lic.events.admin.controller";

const router = Router();

router.post("/", verifyAdmin, controller.createEvent);
router.put("/:id", verifyAdmin, controller.updateEvent);
router.delete("/:id", verifyAdmin, controller.deleteEvent);
router.put("/reorder", verifyAdmin, controller.reorderEvents);

export default router;
