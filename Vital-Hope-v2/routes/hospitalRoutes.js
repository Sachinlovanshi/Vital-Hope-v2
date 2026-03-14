import express from "express";
import {
  registerHospital,
  getNearbyHospitals,
  updateBeds
} from "../controllers/hospitalController.js";
import upload from "../middleware/uploadMiddleware.js";
import { uploadBrochure } from "../controllers/hospitalController.js";
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

router.post(
  "/upload-brochure",
  protect,
  authorize("admin"),
  upload.single("file"),
  uploadBrochure
);

export default router;
