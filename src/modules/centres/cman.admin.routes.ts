import { Router } from "express";
import { verifyAdmin } from "../../middlewares/verifyAdmin";
import * as controller from "./cman.admin.controller";
import * as eventController from "./cman.events.admin.controller";

const router = Router();

// Public
router.get("/committee", controller.getCmanCommittee);
router.get("/students", controller.getCmanStudents);
router.get("/events", eventController.getCmanEvents);

// Admin - Committee
router.post("/committee", verifyAdmin, controller.createCommittee);
router.put("/committee/:id", verifyAdmin, controller.updateCommittee);
router.delete("/committee/:id", verifyAdmin, controller.deleteCommittee);

// Admin - Students
router.post("/students", verifyAdmin, controller.createStudent);
router.put("/students/:id", verifyAdmin, controller.updateStudent);
router.delete("/students/:id", verifyAdmin, controller.deleteStudent);

// Admin - Events
router.post("/events", verifyAdmin, eventController.createEvent);
router.put("/events/:id", verifyAdmin, eventController.updateEvent);
router.delete("/events/:id", verifyAdmin, eventController.deleteEvent);

export default router;
