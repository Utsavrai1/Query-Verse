import mongoose, { Document, Schema } from "mongoose";

export interface IQuestion extends Document {
  title: string;
  content: string;
  author: Schema.Types.ObjectId;
  tags: string[];
  isApproved: boolean;
  createdAt: Date;
}

const questionSchema = new Schema<IQuestion>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tags: [{ type: String }],
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IQuestion>("Question", questionSchema);
