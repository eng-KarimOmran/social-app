import { ObjectId } from "mongoose";
import { LikeType, Visibility } from "./post.type";

export interface createPostDto {
  content?: string;
  allowComments?: boolean;
  visibility?: Visibility;
  attachments?: string[];
  tags?: ObjectId[];
}

export interface likeDto {
  idPost: ObjectId;
  likeType: LikeType;
}

export interface updateDto {
  content?: string;
  allowComments?: boolean;
  visibility?: Visibility;
  attachments?: string[];
  tags?: ObjectId[];
}
