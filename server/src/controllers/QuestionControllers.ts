import { Request, Response } from "express";
import Question from "../models/Question";
import { IUser } from "../models/User";

export const getApprovedQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await Question.find({ isApproved: true }).sort({
      createdAt: -1,
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions" });
  }
};

export const createQuestion = async (req: Request, res: Response) => {
  try {
    const { title, content, tags } = req.body;
    const question = new Question({
      title,
      content,
      tags: tags.split(",").map((tag: string) => tag.trim()),
      author: (req.user as IUser)._id,
    });
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ message: "Error creating question" });
  }
};

export const getUserPendingQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await Question.find({
      author: (req.user as IUser)._id,
      isApproved: false,
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending questions" });
  }
};

export const editQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    console.log(req.body);
    const question = await Question.findOneAndUpdate(
      { _id: id, author: (req.user as IUser)._id, isApproved: false },
      {
        title,
        content,
        tags,
      },
      { new: true }
    );
    if (!question) {
      res.status(404).json({ message: "Question not found or not editable" });
      return;
    }
    res.json(question);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error updating question" });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const question = await Question.findOneAndDelete({
      _id: id,
      author: (req.user as IUser)._id,
      isApproved: false,
    });
    if (!question) {
      res.status(404).json({ message: "Question not found or not deletable" });
      return;
    }
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting question" });
  }
};
