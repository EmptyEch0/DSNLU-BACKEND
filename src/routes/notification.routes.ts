import express from "express";
import {
  getNotifications,
  addNotification,
  updateNotification,
  deleteNotification
} from "../controllers/notification.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", getNotifications);
router.post("/", verifyAdmin, addNotification);
router.put("/:id", verifyAdmin, updateNotification);
router.delete("/:id", verifyAdmin, deleteNotification);

export default router;
