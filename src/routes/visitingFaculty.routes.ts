import express from "express";
import * as visitingFacultyController from "../controllers/visitingFaculty.controller";
import { verifyAdmin } from "../middlewares/verifyAdmin";

const router = express.Router();

// Public route to fetch all visiting faculties
router.get("/all", visitingFacultyController.getVisitingFaculties);

// Admin routes for CRUD operations
router.post("/", verifyAdmin, visitingFacultyController.addVisitingFaculty);
router.put("/:id", verifyAdmin, visitingFacultyController.updateVisitingFaculty);
router.delete("/:id", verifyAdmin, visitingFacultyController.deleteVisitingFaculty);

export default router;
