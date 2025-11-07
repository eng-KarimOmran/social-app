import { model, Schema, Types } from "mongoose";
import { IPost, Visibility } from "../../modules/postModule/post.type";

const postSchema = new Schema<IPost>({
  createdBy: {
    type: Types.ObjectId,
    ref: "users",
    required: true,
  },
  allowComments: {
    type: Boolean,
    default: true,
  },
  content: {
    type: String,
  },
  likes: [{ type: Types.ObjectId, ref: "users" }],
  tags: [{ type: Types.ObjectId, ref: "users" }],
  attachments: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  visibility: {
    type: String,
    enum: Object.values(Visibility),
    default: Visibility.PUBLIC,
  },
  deleteAt: {
    type: Date,
    default: null,
  },
});

export const PostModel = model<IPost>("post", postSchema);
