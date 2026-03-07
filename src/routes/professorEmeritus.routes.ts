import { Router } from "express";
import {
  fetchEmeritusList,
  fetchEmeritusDetail,
  createEmeritus,
  editEmeritus,
  removeEmeritus,
  reorderEmeritusController,
} from "../controllers/professorEmeritus.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/professor-emeritus", fetchEmeritusList);
router.get("/professor-emeritus/:slug", fetchEmeritusDetail);
router.post("/professor-emeritus", verifyAdmin, createEmeritus);
router.put("/professor-emeritus/reorder", verifyAdmin, reorderEmeritusController);
router.put("/professor-emeritus/:id", verifyAdmin, editEmeritus);
router.delete("/professor-emeritus/:id", verifyAdmin, removeEmeritus);

export default router;
