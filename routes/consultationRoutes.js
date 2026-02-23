import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createConsultation } from "../controllers/consultationController.js";

const router = express.Router();

router.post("/create", protect, createConsultation);

export default router;
