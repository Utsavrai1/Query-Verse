import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
  user: Schema.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IComment>("Comment", CommentSchema);
