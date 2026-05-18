import express from "express";

import {
  recommendDisease,
  getSymptoms
} from "../controllers/drugController.js";

import {
  protect,
  authorize
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/symptoms",
  protect,
  authorize("expert"),
  getSymptoms
);

router.post(
  "/recommend",
  protect,
  authorize("expert"),
  recommendDisease
);

export default router;