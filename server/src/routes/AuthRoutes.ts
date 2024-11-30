import express from "express";
import { signup, login, googleLogin } from "../controllers/AuthControllers";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);

export default router;
