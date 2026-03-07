import express from "express";
import * as Controller from "../controllers/library.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = express.Router();

// PUBLIC
router.get("/team", Controller.fetchTeam);
router.get("/committee", Controller.fetchCommittee);
router.get("/timings", Controller.fetchTimings);

// ADMIN
router.post("/team", verifyAdmin, Controller.createTeam);
router.put("/team/:id", verifyAdmin, Controller.editTeam);
router.delete("/team/:id", verifyAdmin, Controller.removeTeam);

router.post("/committee", verifyAdmin, Controller.createCommittee);
router.put("/committee/:id", verifyAdmin, Controller.editCommittee);
router.delete("/committee/:id", verifyAdmin, Controller.removeCommittee);

router.post("/timings", verifyAdmin, Controller.createTiming);
router.put("/timings/:id", verifyAdmin, Controller.editTiming);
router.delete("/timings/:id", verifyAdmin, Controller.removeTiming);

export default router;
