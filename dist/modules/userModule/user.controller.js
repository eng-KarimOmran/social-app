"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_1 = require("./user.service");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const token_1 = require("../../utils/token");
const globalValidationHandler_1 = __importDefault(require("../../middlewares/globalValidationHandler"));
const user_validation_1 = require("./user.validation");
const userRouter = (0, express_1.Router)();
const userServices = new user_service_1.UserServices();
userRouter.use((0, auth_middleware_1.auth)(token_1.TokenType.AccessToken));
userRouter.patch("/profile-image", (0, globalValidationHandler_1.default)(user_validation_1.profileImage), userServices.profileImage);
exports.default = userRouter;
