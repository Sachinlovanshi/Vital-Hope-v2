import express from "express";
import { recommendDisease } from "../controllers/drugController.js";
import {
  protect,
  authorize
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/recommend",
  protect,
  authorize("expert"),
  recommendDisease
);

export default router;