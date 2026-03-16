import express from "express";
import { recommendDrug } from "../controllers/drugController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/recommend",
  protect,
  authorize("expert"),
  recommendDrug
);

export default router;