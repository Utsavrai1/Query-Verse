import express from "express";
import {
  getApprovedQuestions,
  getQuestionById,
  createQuestion,
  editQuestion,
  deleteQuestion,
  getUserPendingQuestions,
  getUniqueTags,
} from "../controllers/QuestionControllers";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.get("/", getApprovedQuestions);
router.get("/id/:id", getQuestionById);
router.get("/pending", authenticate, getUserPendingQuestions);
router.get("/tags", getUniqueTags);
router.post("/", authenticate, createQuestion);
router.put("/:id", authenticate, editQuestion);
router.delete("/:id", authenticate, deleteQuestion);

export default router;
