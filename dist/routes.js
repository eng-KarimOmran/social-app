"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("./modules/authModule/auth.controller"));
const user_controller_1 = __importDefault(require("./modules/userModule/user.controller"));
const getFile_middleware_1 = require("./middlewares/getFile.middleware");
const baseRouter = (0, express_1.Router)();
baseRouter.get("/upload/*path", getFile_middleware_1.getFileMiddleware);
baseRouter.use("/auth", auth_controller_1.default);
baseRouter.use("/user", user_controller_1.default);
exports.default = baseRouter;
