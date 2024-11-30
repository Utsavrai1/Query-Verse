import express from "express";
import { addComment } from "../controllers/CommentControllers";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.post("/:id", authenticate, addComment);

export default router;
