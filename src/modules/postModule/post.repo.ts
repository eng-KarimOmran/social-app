import { Model } from "mongoose";
import { DBRepo } from "../../db/DBRepo";
import { PostModel } from "../../db/models/postModel";
import { IPost } from "./post.type";
export class PostRepo extends DBRepo<IPost> {
  constructor(protected model: Model<IPost> = PostModel) {
    super(model);
  }
}
