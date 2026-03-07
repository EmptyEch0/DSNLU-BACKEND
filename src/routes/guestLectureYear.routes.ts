import { Router } from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin";
import {
  createYear,
  updateYear,
  deleteYear,
  reorderYears
} from "../controllers/guestLectureYear.controller";

const router = Router();

router.post("/", verifyAdmin, createYear);
router.put("/:id", verifyAdmin, updateYear);
router.delete("/:id", verifyAdmin, deleteYear);
router.put("/reorder", verifyAdmin, reorderYears);

export default router;
