import { Router } from "express";
import { verifyAdmin } from "../../middlewares/verifyAdmin";
import * as controller from "./centreResearch.admin.controller";

const router = Router();

// YEAR CRUD
router.post("/year", verifyAdmin, controller.createYear);
router.put("/year/:id", verifyAdmin, controller.updateYear);
router.delete("/year/:id", verifyAdmin, controller.deleteYear);
router.put("/year/reorder", verifyAdmin, controller.reorderYears);

// EVENT CRUD
router.post("/event", verifyAdmin, controller.createEvent);
router.put("/event/:id", verifyAdmin, controller.updateEvent);
router.delete("/event/:id", verifyAdmin, controller.deleteEvent);
router.put("/event/reorder", verifyAdmin, controller.reorderEvents);

export default router;
