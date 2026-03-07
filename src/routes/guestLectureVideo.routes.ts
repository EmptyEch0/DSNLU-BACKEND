import { Router } from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin";
import {
  createVideo,
  updateVideo,
  deleteVideo
} from "../controllers/guestLectureVideo.controller";

const router = Router();

router.post("/", verifyAdmin, createVideo);
router.put("/:id", verifyAdmin, updateVideo);
router.delete("/:id", verifyAdmin, deleteVideo);

export default router;
