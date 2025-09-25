"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SendResponse_1 = __importDefault(require("../../utils/SendResponse"));
const Error_1 = require("../../utils/Error");
const user_repo_1 = require("./user.repo");
const Encryption_1 = require("../../utils/Encryption");
const sendEmail_1 = require("../../utils/SendEmail/sendEmail");
const createOtp_1 = require("../../utils/createOtp");
const otp_repo_1 = require("./otp.repo");
const otpModel_1 = require("../../db/models/otpModel");
class UserServices {
    userModel = new user_repo_1.UserRepo();
    otpModel = new otp_repo_1.OtpRepo();
    constructor() { }
    signup = async (req, res, next) => {
        const { firstName, lastName, email, phone, password } = req.body;
        const userExists = await this.userModel.findByEmail(email);
        if (userExists) {
            throw new Error_1.CustomError("Invalid email", 400);
        }
        const passwordHash = await (0, Encryption_1.hash)(password);
        const user = await this.userModel.create({
            data: { firstName, lastName, email, phone, password: passwordHash },
        });
        const otp = (0, createOtp_1.createOtp)();
        const otpHash = await (0, Encryption_1.hash)(otp);
        await this.otpModel.create({
            data: {
                userId: user._id,
                otp: otpHash,
                typeOtp: otpModel_1.OtpType.confirmedEmail,
                exp: new Date(Date.now() + 5 * 60 * 1000),
            },
        });
        const info = await (0, sendEmail_1.sendEmail)({
            to: email,
            name: `${firstName} ${lastName}`,
            text: otp,
            subject: "Confirm Email",
        });
        return (0, SendResponse_1.default)({
            res,
            message: "Done",
            status: 201,
            data: { user },
        });
    };
}
exports.default = UserServices;
