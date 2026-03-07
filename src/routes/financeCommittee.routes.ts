import { Router } from "express";
import {
  fetchFinanceCommittee,
  createFinanceCommittee,
  editFinanceCommittee,
  removeFinanceCommittee,
  reorderFinance,
} from "../controllers/financeCommittee.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/finance-committee", fetchFinanceCommittee);
router.post("/finance-committee", verifyAdmin, createFinanceCommittee);
router.put("/finance-committee/reorder", verifyAdmin, reorderFinance);
router.put("/finance-committee/:id", verifyAdmin, editFinanceCommittee);
router.delete("/finance-committee/:id", verifyAdmin, removeFinanceCommittee);

export default router;
