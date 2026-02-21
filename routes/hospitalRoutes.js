import express from "express";
import {
  registerHospital,
  getNearbyHospitals,
  updateBeds
} from "../controllers/hospitalController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  protect,
  authorize("admin"),
  registerHospital
);

router.get("/nearby", protect, getNearbyHospitals);

router.put(
  "/update-beds",
  protect,
  authorize("admin"),
  updateBeds
);

export default router;
