"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostServices = void 0;
const post_repo_1 = require("./post.repo");
const postModel_1 = require("../../db/models/postModel");
const mongoose_1 = require("mongoose");
const SendResponse_1 = __importDefault(require("../../utils/SendResponse"));
const userModel_1 = require("../../db/models/userModel");
const Error_1 = require("../../utils/Error");
const globalErrors_1 = require("../../utils/globalErrors");
const post_type_1 = require("./post.type");
const visibilityConditional_1 = require("../../utils/visibilityConditional");
const user_repo_1 = require("../authModule/user.repo");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
class PostServices {
    postModel = new post_repo_1.PostRepo(postModel_1.PostModel);
    userModel = new user_repo_1.UserRepo(userModel_1.UserModel);
    createPost = async (req, res) => {
        const createdBy = req.user?._id;
        let data = { createdBy };
        for (const [key, value] of Object.entries(req.body)) {
            if (key === "tags") {
                const users = await this.userModel.find({
                    filter: { _id: { $in: value } },
                    options: { select: "_id" },
                });
                data[key] = users;
            }
            else {
                data[key] = value;
            }
        }
        if (Array.isArray(req.files) && req.files.length > 0) {
            data.attachments = req.files.map((file) => `/uploads/${createdBy}/${file.filename}`);
        }
        const post = await this.postModel.create({ data });
        return (0, SendResponse_1.default)({ res, status: 201, message: "done", data: { post } });
    };
    like = async (req, res) => {
        const user = req.user;
        const { idPost, likeType } = req.body;
        const post = await this.postModel.findOneAndUpdate({
            _id: idPost,
            $or: (0, visibilityConditional_1.visibilityConditional)(user),
        }, likeType === post_type_1.LikeType.LIKE
            ? { $addToSet: { likes: user._id } }
            : { $pull: { likes: user._id } });
        if (!post) {
            throw new Error_1.CustomError(globalErrors_1.errors.postNotFound.message, globalErrors_1.errors.postNotFound.statusCode);
        }
        return (0, SendResponse_1.default)({ res, data: { post } });
    };
    updatePost = async (req, res) => {
        const { postId } = req.query;
        const userId = req.user?._id;
        mongoose_1.Types;
        let data = {};
        for (const [key, value] of Object.entries(req.body)) {
            if (key === "tags") {
                const users = await this.userModel.find({
                    filter: { _id: { $in: value } },
                    options: { select: "_id" },
                });
                data[key] = users;
            }
            else if (key === "deleteAttachments") {
                for (const pathFile of value) {
                    const filename = pathFile.split("/").at(-1);
                    const src = path_1.default.join(process.cwd(), "uploadMedia", userId.toString(), filename);
                    await fs_1.promises.unlink(src);
                }
            }
            else {
                data[key] = value;
            }
        }
        if (Array.isArray(req.files) && req.files.length > 0) {
            data.attachments = req.files.map((file) => `/uploads/${userId}/${file.filename}`);
        }
        const post = await this.postModel.findOneAndUpdate({ _id: postId, createdBy: userId }, data);
        if (!post) {
            throw new Error_1.CustomError(globalErrors_1.errors.postNotFound.message, globalErrors_1.errors.postNotFound.statusCode);
        }
        return (0, SendResponse_1.default)({ res, data: { post } });
    };
}
exports.PostServices = PostServices;
