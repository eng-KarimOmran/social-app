"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const friendReq_service_1 = require("./friendReq.service");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const token_1 = require("../../utils/token");
const globalValidationHandler_1 = __importDefault(require("../../middlewares/globalValidationHandler"));
const validationFriendReq = __importStar(require("./friendReq.validation"));
const friendServices = new friendReq_service_1.friendReqServices();
const friendRouter = (0, express_1.Router)();
friendRouter.use((0, auth_middleware_1.auth)(token_1.TokenType.AccessToken));
friendRouter.post("/", (0, globalValidationHandler_1.default)(validationFriendReq.addFriend), friendServices.addFriend);
friendRouter.post("/accept-reject", (0, globalValidationHandler_1.default)(validationFriendReq.acceptFriendReq), friendServices.acceptFriendReq);
friendRouter.patch("/unfriend", (0, globalValidationHandler_1.default)(validationFriendReq.unfriend), friendServices.unfriend);
exports.default = friendRouter;
