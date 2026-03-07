import { Router } from "express";
import {
  fetchAllBooks,
  fetchBookBySlug,
  createBook,
  editBook,
  removeBook,
  reorderBooksController,
} from "../controllers/publicationsBooks.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", fetchAllBooks);
router.get("/:slug", fetchBookBySlug);
router.post("/", verifyAdmin, createBook);
router.put("/reorder", verifyAdmin, reorderBooksController);
router.put("/:id", verifyAdmin, editBook);
router.delete("/:id", verifyAdmin, removeBook);

export default router;
