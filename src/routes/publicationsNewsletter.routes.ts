import { Router } from "express";
import {
  fetchAllNewsletters,
  fetchNewsletterBySlug,
  createNewsletter,
  editNewsletter,
  removeNewsletter,
  reorderNewslettersController,
} from "../controllers/publicationsNewsletter.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", fetchAllNewsletters);
router.get("/:slug", fetchNewsletterBySlug);
router.post("/", verifyAdmin, createNewsletter);
router.put("/reorder", verifyAdmin, reorderNewslettersController);
router.put("/:id", verifyAdmin, editNewsletter);
router.delete("/:id", verifyAdmin, removeNewsletter);

export default router;
