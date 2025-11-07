"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRoutes = void 0;
const globalValidationHandler_1 = __importDefault(require("../../middlewares/globalValidationHandler"));
const post_service_1 = require("./post.service");
const express_1 = require("express");
const post_validation_1 = require("./post.validation");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const token_1 = require("../../utils/token");
const multer_1 = require("../../utils/upload/multer");
const postRouter = (0, express_1.Router)();
const postServices = new post_service_1.PostServices();
exports.PostRoutes = {
    create: "/",
    update: "",
    like: "/like",
};
postRouter.use((0, auth_middleware_1.auth)(token_1.TokenType.AccessToken));
postRouter.post(exports.PostRoutes.create, (0, multer_1.upload)().array("attachments", 4), (0, globalValidationHandler_1.default)(post_validation_1.PostValidation.createPost), postServices.createPost);
postRouter.patch(exports.PostRoutes.update, (0, multer_1.upload)().array("attachments", 4), (0, globalValidationHandler_1.default)(post_validation_1.PostValidation.update), postServices.updatePost);
postRouter.patch(exports.PostRoutes.like, (0, globalValidationHandler_1.default)(post_validation_1.PostValidation.like), postServices.like);
exports.default = postRouter;
