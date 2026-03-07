import express from "express";
import { getCategories, getStaffByCategory } from "../controllers/staff.controller";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/by-category/:slug", getStaffByCategory);

export default router;
