import express from "express";
import {
  getApprovedQuestions,
  createQuestion,
  editQuestion,
  deleteQuestion,
  getUserPendingQuestions,
} from "../controllers/QuestionControllers";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.get("/", getApprovedQuestions);
router.post("/", authenticate, createQuestion);
router.put("/:id", authenticate, editQuestion);
router.get("/pending", authenticate, getUserPendingQuestions);
router.delete("/:id", authenticate, deleteQuestion);

export default router;
