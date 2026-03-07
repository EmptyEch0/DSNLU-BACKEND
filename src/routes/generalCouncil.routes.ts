import { Router } from "express";
import {
  fetchGeneralCouncil,
  createGeneralCouncil,
  editGeneralCouncil,
  removeGeneralCouncil,
  reorderGeneral,
} from "../controllers/generalCouncil.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/general-council", fetchGeneralCouncil);
router.post("/general-council", verifyAdmin, createGeneralCouncil);
router.put("/general-council/reorder", verifyAdmin, reorderGeneral);
router.put("/general-council/:id", verifyAdmin, editGeneralCouncil);
router.delete("/general-council/:id", verifyAdmin, removeGeneralCouncil);

export default router;
