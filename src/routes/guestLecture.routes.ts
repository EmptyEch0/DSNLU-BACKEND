import { Router } from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin";
import {
  getGuestLectures,
  createLecture,
  updateLecture,
  deleteLecture,
  reorderLectures
} from "../controllers/guestLecture.controller";

const router = Router();

// Public
router.get("/", getGuestLectures);

// Admin
router.post("/", verifyAdmin, createLecture);
router.put("/:id", verifyAdmin, updateLecture);
router.delete("/:id", verifyAdmin, deleteLecture);
router.put("/reorder", verifyAdmin, reorderLectures);

export default router;
