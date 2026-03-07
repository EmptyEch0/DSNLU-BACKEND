import express from "express";
import { 
  getStudentWelfare, 
  addOfficial, 
  updateOfficial, 
  deleteOfficial 
} from "../controllers/studentWelfare.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = express.Router();

// Public route
router.get("/student-welfare", getStudentWelfare);

// Admin routes
router.post("/admin/student-welfare", verifyAdmin, addOfficial);
router.put("/admin/student-welfare/:id", verifyAdmin, updateOfficial);
router.delete("/admin/student-welfare/:id", verifyAdmin, deleteOfficial);

export default router;
