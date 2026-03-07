import express from "express";
import { 
  addStaff, 
  updateStaff, 
  deleteStaff, 
  reorderStaff,
  addCategory,
  updateCategory,
  deleteCategory
} from "../controllers/staff.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = express.Router();

// Staff CRUD
router.post("/staff", verifyAdmin, addStaff);
router.put("/staff/:id", verifyAdmin, updateStaff);
router.delete("/staff/:id", verifyAdmin, deleteStaff);
router.patch("/staff/reorder", verifyAdmin, reorderStaff);

// Category CRUD
router.post("/staff-category", verifyAdmin, addCategory);
router.put("/staff-category/:id", verifyAdmin, updateCategory);
router.delete("/staff-category/:id", verifyAdmin, deleteCategory);

export default router;
