import express from "express";
import * as Controller from "../controllers/libraryResources.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = express.Router();

/* ─── Public GETs ─── */
router.get("/ebooks", Controller.fetchEBooks);
router.get("/edatabases", Controller.fetchEDatabases);
router.get("/ejournals", Controller.fetchEJournals);

/* ─── Admin CRUD ─── */
// Note: To match the user's frontend snippet, we'll prefix these with admin/ if registered at /api/library
// Or simply use the same paths but with POST/PUT/DELETE
router.post("/ebooks", verifyAdmin, Controller.createEBook);
router.put("/ebooks/:id", verifyAdmin, Controller.editEBook);
router.delete("/ebooks/:id", verifyAdmin, Controller.removeEBook);

router.post("/edatabases", verifyAdmin, Controller.createEDatabase);
router.put("/edatabases/:id", verifyAdmin, Controller.editEDatabase);
router.delete("/edatabases/:id", verifyAdmin, Controller.removeEDatabase);

router.post("/ejournals", verifyAdmin, Controller.createEJournal);
router.put("/ejournals/:id", verifyAdmin, Controller.editEJournal);
router.delete("/ejournals/:id", verifyAdmin, Controller.removeEJournal);

// For compatibility with the user's suggested snippet:
router.post("/admin/library/ebooks", verifyAdmin, Controller.createEBook);
router.put("/admin/library/ebooks/:id", verifyAdmin, Controller.editEBook);
router.delete("/admin/library/ebooks/:id", verifyAdmin, Controller.removeEBook);

export default router;
