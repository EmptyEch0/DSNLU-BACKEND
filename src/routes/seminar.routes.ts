import { Router } from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin";
import {
  getSeminars,
  createYear,
  updateYear,
  deleteYear,
  createSeminar,
  updateSeminar,
  deleteSeminar,
  createDay,
  updateDay,
  deleteDay,
  addImage,
  deleteImage,
  addSubject,
  deleteSubject,
  addGuest,
  deleteGuest
} from "../controllers/seminar.controller";

const router = Router();

/* Public */
router.get("/seminars", getSeminars);

/* Admin - YEARS */
router.post("/seminars/years", verifyAdmin, createYear);
router.put("/seminars/years/:id", verifyAdmin, updateYear);
router.delete("/seminars/years/:id", verifyAdmin, deleteYear);

/* Admin - SEMINARS */
router.post("/seminars", verifyAdmin, createSeminar);
router.put("/seminars/:id", verifyAdmin, updateSeminar);
router.delete("/seminars/:id", verifyAdmin, deleteSeminar);

/* Admin - DAYS */
router.post("/seminars/days", verifyAdmin, createDay);
router.put("/seminars/days/:id", verifyAdmin, updateDay);
router.delete("/seminars/days/:id", verifyAdmin, deleteDay);

/* Admin - IMAGES */
router.post("/seminars/images", verifyAdmin, addImage);
router.delete("/seminars/images/:id", verifyAdmin, deleteImage);

/* Admin - SUBJECTS */
router.post("/seminars/subjects", verifyAdmin, addSubject);
router.delete("/seminars/subjects/:id", verifyAdmin, deleteSubject);

/* Admin - GUESTS */
router.post("/seminars/guests", verifyAdmin, addGuest);
router.delete("/seminars/guests/:id", verifyAdmin, deleteGuest);

export default router;
