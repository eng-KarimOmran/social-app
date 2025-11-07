import { HydratedDocument, ObjectId } from "mongoose";

export enum Visibility {
  PUBLIC = "public",
  FRIENDS = "friends",
  PRIVATE = "private",
}

export interface IPost {
  createdBy: ObjectId;
  content?: string;
  allowComments?: boolean;
  likes?: ObjectId[];
  visibility?: Visibility;
  attachments?: string[];
  tags?: ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  deleteAt?: Date | null;
}

export type PostDocument = HydratedDocument<IPost>;

export enum LikeType {
  LIKE = "like",
  UNLIKE = "unLike",
}
