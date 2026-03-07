import { Router } from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin";
import {
  getNMC,
  updateCompetition,
  addTimeline,
  updateTimeline,
  deleteTimeline,
  updateRegistration,
  updateContact,
  addCoordinator,
  deleteCoordinator,
  addEdition,
  updateEdition,
  deleteEdition,
  addGalleryImage,
  deleteGalleryImage
} from "../controllers/competition.controller";

const router = Router();

/* Public */
router.get("/nmc", getNMC);

/* Admin */
router.put("/nmc", verifyAdmin, updateCompetition);

router.post("/timeline", verifyAdmin, addTimeline);
router.put("/timeline/:id", verifyAdmin, updateTimeline);
router.delete("/timeline/:id", verifyAdmin, deleteTimeline);

router.put("/registration/:id", verifyAdmin, updateRegistration);

router.put("/contact/:id", verifyAdmin, updateContact);

router.post("/coordinators", verifyAdmin, addCoordinator);
router.delete("/coordinators/:id", verifyAdmin, deleteCoordinator);

router.post("/editions", verifyAdmin, addEdition);
router.put("/editions/:id", verifyAdmin, updateEdition);
router.delete("/editions/:id", verifyAdmin, deleteEdition);

router.post("/gallery", verifyAdmin, addGalleryImage);
router.delete("/gallery/:id", verifyAdmin, deleteGalleryImage);

export default router;
