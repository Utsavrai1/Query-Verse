import { Request, Response } from "express";
import Question from "../models/Question";

export const getPendingQuestions = async (req: Request, res: Response) => {
  try {
    const pendingQuestions = await Question.find({ isApproved: false })
      .sort({
        createdAt: -1,
      })
      .populate("author", "name email")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "user",
          select: "name email",
        },
      });

    const nonPendingQuestions = await Question.find({ isApproved: true })
      .sort({
        createdAt: -1,
      })
      .populate("author", "name email")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "user",
          select: "name email",
        },
      });

    const questions = [...pendingQuestions, ...nonPendingQuestions];

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions" });
  }
};

export const approveQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const question = await Question.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );
    if (!question) {
      res.status(404).json({ message: "Question not found" });
      return;
    }
    res.json(question);
  } catch (error) {
    res.status(400).json({ message: "Error approving question" });
  }
};

export const rejectQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const question = await Question.findByIdAndDelete(id);
    if (!question) {
      res.status(404).json({ message: "Question not found" });
      return;
    }
    res.json({ message: "Question rejected and deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error rejecting question" });
  }
};
