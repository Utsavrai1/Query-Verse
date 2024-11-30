import { Request, Response } from "express";
import Question from "../models/Question";
import Comment from "../models/Comment";
import { IUser } from "../models/User";
import { ObjectId } from "mongoose";

export const addComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = (req.user as IUser)._id;

    const question = await Question.findById(id);

    if (!question) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    const comment = new Comment({
      user: userId,
      content,
      createdAt: new Date(),
    });

    question.comments.push(comment._id as ObjectId);
    await comment.save();
    await question.save();

    const updateQuestion = await Question.findById(id)
      .populate("author", "name email")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "user",
          select: "name email",
        },
      });

    res.status(201).json({
      message: "Comment added successfully",
      question: updateQuestion,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding comment" });
  }
};
