import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createConsultation } from "../controllers/consultationController.js";
import { endConsultation } from "../controllers/consultationController.js";
import {
  acceptConsultation,
  rejectConsultation
} from "../controllers/consultationController.js";

const router = express.Router();

router.post("/create", protect, createConsultation);
router.post("/end", protect, endConsultation);
router.post("/accept", protect, acceptConsultation);
router.post("/reject", protect, rejectConsultation);

export default router;
