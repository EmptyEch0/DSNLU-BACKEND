import { Router } from "express";
import { getCurrentVisitor, createVisitor, getAllVisitors, updateVisitor } from "../controllers/visitor.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/current", getCurrentVisitor);
router.get("/all", getAllVisitors);
router.post("/", verifyAdmin, createVisitor);
router.put("/current", verifyAdmin, updateVisitor);
router.put("/:id", verifyAdmin, updateVisitor);

export default router;
