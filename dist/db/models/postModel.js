"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = void 0;
const mongoose_1 = require("mongoose");
const post_type_1 = require("../../modules/postModule/post.type");
const postSchema = new mongoose_1.Schema({
    createdBy: {
        type: mongoose_1.Types.ObjectId,
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
    likes: [{ type: mongoose_1.Types.ObjectId, ref: "users" }],
    tags: [{ type: mongoose_1.Types.ObjectId, ref: "users" }],
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
        enum: Object.values(post_type_1.Visibility),
        default: post_type_1.Visibility.PUBLIC,
    },
    deleteAt: {
        type: Date,
        default: null,
    },
});
exports.PostModel = (0, mongoose_1.model)("post", postSchema);
