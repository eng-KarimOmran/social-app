"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const user_repo_1 = require("../authModule/user.repo");
const SendResponse_1 = __importDefault(require("../../utils/SendResponse"));
const s3_Service_1 = require("../../utils/upload/s3.Service");
class UserServices {
    userModel = new user_repo_1.UserRepo();
    constructor() { }
    profileImage = async (req, res) => {
        const user = req.user;
        const { contentType, originalname, } = req.body;
        const { Key, url } = await (0, s3_Service_1.ceratePreSignedUrl)({
            ContentType: contentType,
            originalname,
            path: `users/${user.firstName}_${user.lastName}_${user._id}`,
        });
        user.profileImage = Key;
        await user.save();
        return (0, SendResponse_1.default)({
            res,
            message: "The image has been uploaded successfully",
            status: 200,
            data: { url },
        });
    };
}
exports.UserServices = UserServices;
