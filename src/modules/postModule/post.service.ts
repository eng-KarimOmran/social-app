import { Response } from "express";
import { IRequest } from "../../middlewares/auth.middleware";
import { PostRepo } from "./post.repo";
import { PostModel } from "../../db/models/postModel";
import { HydratedDocument, Types } from "mongoose";
import sendResponse from "../../utils/SendResponse";
import { IUser, UserModel } from "../../db/models/userModel";
import { createPostDto, likeDto } from "./post.DTO";
import { CustomError } from "../../utils/Error";
import { errors } from "../../utils/globalErrors";
import { LikeType } from "./post.type";
import { visibilityConditional } from "../../utils/visibilityConditional";
import { UserRepo } from "../authModule/user.repo";
import { promises as fs } from "fs";
import path from "path";

interface IPostServices {
  createPost(req: IRequest, res: Response): Promise<Response>;
  like(req: IRequest, res: Response): Promise<Response>;
  updatePost(req: IRequest, res: Response): Promise<Response>;
}

export class PostServices implements IPostServices {
  postModel = new PostRepo(PostModel);
  userModel = new UserRepo(UserModel);
  createPost = async (req: IRequest, res: Response): Promise<Response> => {
    const createdBy = req.user?._id;

    let data: Record<string, any> = { createdBy };
    for (const [key, value] of Object.entries(req.body as createPostDto)) {
      if (key === "tags") {
        const users = await this.userModel.find({
          filter: { _id: { $in: value } },
          options: { select: "_id" },
        });
        data[key] = users;
      } else {
        data[key] = value;
      }
    }
    if (Array.isArray(req.files) && req.files.length > 0) {
      data.attachments = req.files.map(
        (file) => `/uploads/${createdBy}/${file.filename}`
      );
    }
    const post = await this.postModel.create({ data });
    return sendResponse({ res, status: 201, message: "done", data: { post } });
  };
  like = async (req: IRequest, res: Response): Promise<Response> => {
    const user = req.user as HydratedDocument<IUser>;
    const { idPost, likeType }: likeDto = req.body;
    const post = await this.postModel.findOneAndUpdate(
      {
        _id: idPost,
        $or: visibilityConditional(user),
      },
      likeType === LikeType.LIKE
        ? { $addToSet: { likes: user._id } }
        : { $pull: { likes: user._id } }
    );
    if (!post) {
      throw new CustomError(
        errors.postNotFound.message,
        errors.postNotFound.statusCode
      );
    }
    return sendResponse({ res, data: { post } });
  };
  updatePost = async (req: IRequest, res: Response): Promise<Response> => {
    const { postId } = req.query;
    const userId = req.user?._id as Types.ObjectId;
    Types;

    let data: Record<string, any> = {};
    for (const [key, value] of Object.entries(req.body as createPostDto)) {
      if (key === "tags") {
        const users = await this.userModel.find({
          filter: { _id: { $in: value } },
          options: { select: "_id" },
        });
        data[key] = users;
      } else if (key === "deleteAttachments") {
        for (const pathFile of value) {
          const filename = pathFile.split("/").at(-1);
          const src = path.join(
            process.cwd(),
            "uploadMedia",
            userId.toString(),
            filename
          );

          await fs.unlink(src);
        }
      } else {
        data[key] = value;
      }
    }
    if (Array.isArray(req.files) && req.files.length > 0) {
      data.attachments = req.files.map(
        (file) => `/uploads/${userId}/${file.filename}`
      );
    }
    const post = await this.postModel.findOneAndUpdate(
      { _id: postId, createdBy: userId },
      data
    );
    if (!post) {
      throw new CustomError(
        errors.postNotFound.message,
        errors.postNotFound.statusCode
      );
    }
    return sendResponse({ res, data: { post } });
  };
}
