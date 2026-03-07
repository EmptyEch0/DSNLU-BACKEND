import express from "express";
import { getCurrentRegistrar, updateRegistrar } from "../controllers/registrar.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/current", getCurrentRegistrar);
router.put("/:id", verifyAdmin, updateRegistrar);

export default router;
