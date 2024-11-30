import express from "express";
import {
  likeQuestion,
  dislikeQuestion,
} from "../controllers/LikeDislikeControllers";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.post("/like/:id", authenticate, likeQuestion);
router.post("/dislike/:id", authenticate, dislikeQuestion);

export default router;
