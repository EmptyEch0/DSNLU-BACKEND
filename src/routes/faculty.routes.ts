import express from "express";
import * as facultyController from "../controllers/faculty.controller";

const router = express.Router();

// Public routes
router.get("/all", facultyController.getCategories); // For overall list if needed
router.get("/categories", facultyController.getCategories);
router.get("/by-category/:slug", facultyController.getFacultyByCategory);
router.get("/profile/:slug", facultyController.getFacultyProfile);

export default router;
