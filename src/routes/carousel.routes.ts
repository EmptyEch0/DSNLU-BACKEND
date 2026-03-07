import express from "express";
import {
  getCarousel,
  addCarousel,
  updateCarousel,
  deleteCarousel,
  reorderCarousel,
} from "../controllers/carousel.controller";
import { verifyAdmin } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload";

const router = express.Router();

router.get("/", getCarousel);
router.put("/reorder", verifyAdmin, reorderCarousel);

router.post("/", verifyAdmin, upload.single("image"), addCarousel);
router.put("/:id", verifyAdmin, upload.single("image"), updateCarousel);
router.delete("/:id", verifyAdmin, deleteCarousel);

export default router;
