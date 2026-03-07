import express from "express";
import * as Controller from "../controllers/librarySections.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", Controller.fetchSections);

router.post("/section", verifyAdmin, Controller.createSection);
router.put("/section/:id", verifyAdmin, Controller.editSection);
router.delete("/section/:id", verifyAdmin, Controller.removeSection);

router.post("/item", verifyAdmin, Controller.createItem);
router.put("/item/:id", verifyAdmin, Controller.editItem);
router.delete("/item/:id", verifyAdmin, Controller.removeItem);

export default router;
