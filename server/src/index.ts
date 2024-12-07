import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import authRoute from "./routes/AuthRoutes";
import questionRoute from "./routes/QuestionRoutes";
import reactRoute from "./routes/LikeDislikeRoutes";
import commentRoute from "./routes/CommentRoutes";
import adminRoutes from "./routes/AdminRoutes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["https://query-verse-tau.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(morgan("tiny"));

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req: Request, res: Response) => {
  res.send("Q&A Finance App");
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/question", questionRoute);
app.use("/api/v1/react", reactRoute);
app.use("/api/v1/comment", commentRoute);
app.use("/api/v1/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
