import express from "express";
import * as facultyController from "../controllers/faculty.controller";
import { verifyAdmin } from "../middlewares/verifyAdmin";

const router = express.Router();

// Faculty CRUD
router.post("/", verifyAdmin, facultyController.addFaculty);
router.put("/:id", verifyAdmin, facultyController.updateFaculty);
router.delete("/:id", verifyAdmin, facultyController.deleteFaculty);
router.patch("/reorder", verifyAdmin, facultyController.reorderFaculty);

// Category CRUD
router.post("/category", verifyAdmin, facultyController.addCategory);
router.put("/category/:id", verifyAdmin, facultyController.updateCategory);
router.delete("/category/:id", verifyAdmin, facultyController.deleteCategory);

export default router;
