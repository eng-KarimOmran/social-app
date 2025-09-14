"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_1 = __importDefault(require("./user.service"));
const globalValidationHandler_js_1 = __importDefault(require("../../middlewares/globalValidationHandler.js"));
const user_validation_js_1 = require("./user.validation.js");
const userRouter = (0, express_1.Router)();
const userServices = new user_service_1.default();
userRouter.post("/signup", (0, globalValidationHandler_js_1.default)(user_validation_js_1.signupSchema), userServices.signup);
exports.default = userRouter;
