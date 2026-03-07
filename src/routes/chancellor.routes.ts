import express from "express";
import {
  getCurrentChancellor,
  getAllChancellors,
  updateChancellor,
} from "../controllers/chancellor.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/current", getCurrentChancellor);
router.get("/", getAllChancellors);
router.put("/:id", verifyAdmin, updateChancellor);

export default router;
