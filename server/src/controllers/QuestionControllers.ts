import { Request, Response } from "express";
import Question from "../models/Question";
import { IUser } from "../models/User";

export const getApprovedQuestions = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, searchText = "", tags = "" } = req.query;

    const tagsArray = tags ? (tags as string).split(",") : [];

    console.log("Parsed Tags Array:", tagsArray);

    const query: any = { isApproved: true };

    if (searchText) {
      query.$or = [
        { title: { $regex: searchText, $options: "i" } },
        { content: { $regex: searchText, $options: "i" } },
      ];
    }

    if (tagsArray.length > 0) {
      query.tags = { $in: tagsArray };
    }

    console.log("Constructed Query:", query);

    const skip = (Number(page) - 1) * Number(limit);

    const questions = await Question.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("author", "name email")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "user",
          select: "name email",
        },
      });

    const totalQuestions = await Question.countDocuments(query);

    res.json({
      questions,
      totalPages: Math.ceil(totalQuestions / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
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

export const getUniqueTags = async (req: Request, res: Response) => {
  try {
    const tags = await Question.distinct("tags", { isApproved: true });
    res.status(200).send(tags);
  } catch (error) {
    console.error("Error fetching unique tags:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getQuestionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id)
      .populate("author", "name email")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "user",
          select: "name email",
        },
      });
    if (!question) {
      res.status(404).json({ message: "Question not found" });
      return;
    }
    res.json(question);
  } catch (error) {
    res.status(400).json({ message: "Error fetching question" });
  }
};
