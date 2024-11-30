import mongoose, { Document, Schema } from "mongoose";

export interface IQuestion extends Document {
  title: string;
  content: string;
  author: Schema.Types.ObjectId;
  tags: string[];
  isApproved: boolean;
  createdAt: Date;
  comments: Schema.Types.ObjectId[];
  likes: Schema.Types.ObjectId[];
  dislikes: Schema.Types.ObjectId[];
}

const questionSchema = new Schema<IQuestion>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tags: [{ type: String }],
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model<IQuestion>("Question", questionSchema);
