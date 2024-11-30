import { Request, Response } from "express";
import Question from "../models/Question";
import { IUser } from "../models/User";
import { ObjectId } from "mongoose";

export const likeQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.user as IUser)._id as ObjectId;

    const question = await Question.findById(id);
    if (!question) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    question.dislikes = question.dislikes.filter(
      (user) => user.toString() !== userId.toString()
    );

    if (question.likes.includes(userId)) {
      question.likes = question.likes.filter(
        (user) => user.toString() !== userId.toString()
      );
    } else {
      question.likes.push(userId);
    }

    await question.save();

    res.status(200).json({ message: "Like updated successfully", question });
  } catch (error) {
    res.status(500).json({ message: "Error updating like" });
  }
};

export const dislikeQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.user as IUser)._id as ObjectId;

    const question = await Question.findById(id);
    if (!question) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    question.likes = question.likes.filter(
      (user) => user.toString() !== userId.toString()
    );

    if (question.dislikes.includes(userId)) {
      question.dislikes = question.dislikes.filter(
        (user) => user.toString() !== userId.toString()
      );
    } else {
      question.dislikes.push(userId);
    }

    await question.save();

    res.status(200).json({ message: "Dislike updated successfully", question });
  } catch (error) {
    res.status(500).json({ message: "Error updating dislike" });
  }
};
