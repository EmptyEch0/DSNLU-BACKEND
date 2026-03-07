import { Router } from "express";
import * as ctrl from "../controllers/journal.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = Router();

// Full journal (single fetch)
router.get("/full", ctrl.fetchFullJournal);

// About
router.get("/about", ctrl.fetchAbout);
router.put("/about", verifyAdmin, ctrl.editAbout);

// Contacts
router.get("/contacts", ctrl.fetchContacts);
router.post("/contacts", verifyAdmin, ctrl.createContact);
router.put("/contacts/:id", verifyAdmin, ctrl.editContact);
router.delete("/contacts/:id", verifyAdmin, ctrl.removeContact);

// Guidelines
router.get("/guidelines", ctrl.fetchGuidelines);
router.post("/guidelines", verifyAdmin, ctrl.createGuideline);
router.put("/guidelines/:id", verifyAdmin, ctrl.editGuideline);
router.delete("/guidelines/:id", verifyAdmin, ctrl.removeGuideline);

// Word Limits
router.get("/wordlimits", ctrl.fetchWordLimits);
router.post("/wordlimits", verifyAdmin, ctrl.createWordLimit);
router.put("/wordlimits/:id", verifyAdmin, ctrl.editWordLimit);
router.delete("/wordlimits/:id", verifyAdmin, ctrl.removeWordLimit);

// Board
router.get("/board", ctrl.fetchBoard);
router.post("/board", verifyAdmin, ctrl.createBoardMember);
router.put("/board/:id", verifyAdmin, ctrl.editBoardMember);
router.delete("/board/:id", verifyAdmin, ctrl.removeBoardMember);

// Archives
router.get("/archives", ctrl.fetchArchives);
router.post("/archives", verifyAdmin, ctrl.createArchive);
router.put("/archives/:id", verifyAdmin, ctrl.editArchive);
router.delete("/archives/:id", verifyAdmin, ctrl.removeArchive);

export default router;
