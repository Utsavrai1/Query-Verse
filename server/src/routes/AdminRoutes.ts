import express from "express";
import {
  getPendingQuestions,
  approveQuestion,
  rejectQuestion,
} from "../controllers/AdminControllers";
import { authenticate, isAdmin } from "../middleware/auth";

const router = express.Router();

router.get("/pending-questions", authenticate, isAdmin, getPendingQuestions);
router.put("/approve/:id", authenticate, isAdmin, approveQuestion);
router.delete("/reject/:id", authenticate, isAdmin, rejectQuestion);

export default router;
