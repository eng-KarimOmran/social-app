"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globalErrors_1 = require("./../../utils/globalErrors");
const SendResponse_1 = __importDefault(require("../../utils/SendResponse"));
const Error_1 = require("../../utils/Error");
const user_repo_1 = require("./user.repo");
const Encryption_1 = require("../../utils/Encryption");
const sendEmail_1 = require("../../utils/SendEmail/sendEmail");
const otp_repo_1 = require("./otp.repo");
const otpModel_1 = require("../../db/models/otpModel");
const token_1 = require("../../utils/token");
const createCode_1 = require("../../utils/createCode");
const nanoid_1 = require("nanoid");
const invalidToken_repo_1 = require("./invalidToken.repo");
class AuthServices {
    userModel = new user_repo_1.UserRepo();
    otpModel = new otp_repo_1.OtpRepo();
    invalidTokenModel = new invalidToken_repo_1.InvalidTokenRepo();
    constructor() { }
    signup = async (req, res) => {
        const { firstName, lastName, email, phone, password } = req.body;
        const userExists = await this.userModel.findByEmail(email);
        if (userExists) {
            throw new Error_1.CustomError(globalErrors_1.errors.userAlreadyExists.message, globalErrors_1.errors.userAlreadyExists.statusCode);
        }
        const user = await this.userModel.create({
            data: { firstName, lastName, email, phone, password },
        });
        const otp = (0, createCode_1.createCode)();
        const otpHash = await (0, Encryption_1.hash)(otp);
        await this.otpModel.create({
            data: {
                email,
                otp: otpHash,
                typeOtp: otpModel_1.OtpType.confirmedEmail,
                exp: new Date(Date.now() + 5 * 60 * 1000),
            },
        });
        await (0, sendEmail_1.sendEmail)({
            to: email,
            name: `${firstName} ${lastName}`,
            text: otp,
            subject: "Confirm Email",
        });
        const jwtid = (0, nanoid_1.nanoid)();
        const accessToken = (0, token_1.createToken)(token_1.TokenType.AccessToken, { userId: user._id }, jwtid);
        const refreshToken = (0, token_1.createToken)(token_1.TokenType.RefreshToken, { userId: user._id }, jwtid);
        return (0, SendResponse_1.default)({
            res,
            message: "Done",
            status: 201,
            data: { accessToken, refreshToken },
        });
    };
    confirmEmail = async (req, res) => {
        const { email, otp } = req.body;
        const userExists = await this.userModel.findByEmail(email);
        if (!userExists) {
            throw new Error_1.CustomError(globalErrors_1.errors.userNotFound.message, globalErrors_1.errors.userNotFound.statusCode);
        }
        const otpExists = await this.otpModel.findOne({
            filter: { email, typeOtp: otpModel_1.OtpType.confirmedEmail },
        });
        if (!otpExists) {
            throw new Error_1.CustomError(globalErrors_1.errors.codeNotRequested.message, globalErrors_1.errors.codeNotRequested.statusCode);
        }
        const isMatch = await (0, Encryption_1.compare)(otp, otpExists.otp);
        if (!isMatch) {
            throw new Error_1.CustomError(globalErrors_1.errors.invalidCode.message, globalErrors_1.errors.invalidCode.statusCode);
        }
        if (new Date(otpExists.exp).getTime() < Date.now()) {
            throw new Error_1.CustomError(globalErrors_1.errors.expiredCode.message, globalErrors_1.errors.expiredCode.statusCode);
        }
        userExists.emailConfirmed = true;
        await userExists.save();
        await this.otpModel.deleteOne({
            filter: { email, typeOtp: otpModel_1.OtpType.confirmedEmail },
        });
        return (0, SendResponse_1.default)({
            res,
            message: "Email verified",
            status: 200,
        });
    };
    resendConfirmEmailCode = async (req, res) => {
        const { email } = req.body;
        const userExists = await this.userModel.findByEmail(email);
        if (!userExists) {
            throw new Error_1.CustomError(globalErrors_1.errors.userNotFound.message, globalErrors_1.errors.userNotFound.statusCode);
        }
        if (userExists.emailConfirmed) {
            throw new Error_1.CustomError(globalErrors_1.errors.emailAlreadyConfirmed.message, globalErrors_1.errors.emailAlreadyConfirmed.statusCode);
        }
        const otpExists = await this.otpModel.findOne({
            filter: { email, typeOtp: otpModel_1.OtpType.confirmedEmail },
        });
        if (!otpExists) {
            throw new Error_1.CustomError(globalErrors_1.errors.codeNotRequested.message, globalErrors_1.errors.codeNotRequested.statusCode);
        }
        if (otpExists.exp.getTime() > Date.now()) {
            throw new Error_1.CustomError(globalErrors_1.errors.codeAlreadySent.message, globalErrors_1.errors.codeAlreadySent.statusCode);
        }
        const otp = (0, createCode_1.createCode)();
        const otpHash = await (0, Encryption_1.hash)(otp);
        otpExists.otp = otpHash;
        otpExists.exp = new Date(Date.now() + 5 * 60 * 1000);
        await otpExists.save();
        await (0, sendEmail_1.sendEmail)({
            to: email,
            name: `${userExists.firstName} ${userExists.lastName}`,
            text: otp,
            subject: "Confirm Email",
        });
        return (0, SendResponse_1.default)({
            res,
            message: "The code has been sent.",
            status: 200,
        });
    };
    login = async (req, res) => {
        const { email, password } = req.body;
        const userExists = await this.userModel.findByEmail(email);
        if (!userExists) {
            throw new Error_1.CustomError(globalErrors_1.errors.userNotFound.message, globalErrors_1.errors.userNotFound.statusCode);
        }
        const isMatch = await (0, Encryption_1.compare)(password, userExists.password);
        if (!isMatch) {
            throw new Error_1.CustomError(globalErrors_1.errors.invalidPassword.message, globalErrors_1.errors.invalidPassword.statusCode);
        }
        const jwtid = (0, nanoid_1.nanoid)();
        const accessToken = (0, token_1.createToken)(token_1.TokenType.AccessToken, { userId: userExists._id }, jwtid);
        const refreshToken = (0, token_1.createToken)(token_1.TokenType.RefreshToken, { userId: userExists._id }, jwtid);
        userExists.deleteAt = null;
        await userExists.save();
        return (0, SendResponse_1.default)({
            res,
            message: "Done",
            status: 200,
            data: { accessToken, refreshToken },
        });
    };
    logout = async (req, res) => {
        const jti = req.payload?.jti;
        const exp = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
        await this.invalidTokenModel.create({ data: { jti, exp } });
        return (0, SendResponse_1.default)({
            res,
            message: "You are logged out",
            status: 200,
        });
    };
    refreshToken = async (req, res) => {
        const jti = req.payload?.jti;
        const userId = req.payload?.userId;
        const accessToken = (0, token_1.createToken)(token_1.TokenType.AccessToken, { userId }, jti);
        return (0, SendResponse_1.default)({
            res,
            message: "Done",
            status: 200,
            data: { accessToken },
        });
    };
    forgotPassword = async (req, res) => {
        const { email } = req.body;
        const userExists = await this.userModel.findByEmail(email);
        if (!userExists) {
            throw new Error_1.CustomError(globalErrors_1.errors.userNotFound.message, globalErrors_1.errors.userNotFound.statusCode);
        }
        const otpExists = await this.otpModel.findOne({
            filter: { email, typeOtp: otpModel_1.OtpType.ResetPassword },
        });
        if (otpExists && otpExists.exp.getTime() > Date.now()) {
            throw new Error_1.CustomError(globalErrors_1.errors.codeAlreadySent.message, globalErrors_1.errors.codeAlreadySent.statusCode);
        }
        await this.otpModel.deleteMany({
            filter: {
                email,
                typeOtp: otpModel_1.OtpType.ResetPassword,
            },
        });
        const otp = (0, createCode_1.createCode)();
        const otpHash = await (0, Encryption_1.hash)(otp);
        await (0, sendEmail_1.sendEmail)({
            to: email,
            name: `${userExists.firstName} ${userExists.lastName}`,
            text: otp,
            subject: "Reset Password",
        });
        await this.otpModel.create({
            data: {
                email,
                otp: otpHash,
                typeOtp: otpModel_1.OtpType.ResetPassword,
                exp: new Date(Date.now() + 5 * 60 * 1000),
            },
        });
        return (0, SendResponse_1.default)({
            res,
            message: "The code has been sent.",
            status: 200,
        });
    };
    verifyPasswordResetCode = async (req, res) => {
        const { email, otp } = req.body;
        const userExists = await this.userModel.findByEmail(email);
        if (!userExists) {
            throw new Error_1.CustomError(globalErrors_1.errors.userNotFound.message, globalErrors_1.errors.userNotFound.statusCode);
        }
        const otpExists = await this.otpModel.findOne({
            filter: { email, typeOtp: otpModel_1.OtpType.ResetPassword },
        });
        if (!otpExists) {
            throw new Error_1.CustomError(globalErrors_1.errors.codeNotRequested.message, globalErrors_1.errors.codeNotRequested.statusCode);
        }
        const isMatch = await (0, Encryption_1.compare)(otp, otpExists.otp);
        if (!isMatch) {
            throw new Error_1.CustomError(globalErrors_1.errors.invalidCode.message, globalErrors_1.errors.invalidCode.statusCode);
        }
        if (new Date(otpExists.exp).getTime() < Date.now()) {
            throw new Error_1.CustomError(globalErrors_1.errors.expiredCode.message, globalErrors_1.errors.expiredCode.statusCode);
        }
        const jwtid = (0, nanoid_1.nanoid)();
        const passwordToken = (0, token_1.createToken)(token_1.TokenType.PasswordToken, { userId: userExists._id }, jwtid);
        return (0, SendResponse_1.default)({
            res,
            message: "The code has been verified.",
            status: 200,
            data: {
                passwordToken,
            },
        });
    };
    changePassword = async (req, res) => {
        const { password } = req.body;
        const jti = req.payload?.jti;
        const user = req.user;
        const exp = new Date(Date.now() + 1000 * 60 * 15);
        await this.invalidTokenModel.create({ data: { jti, exp } });
        user.password = password;
        await user.save();
        return (0, SendResponse_1.default)({
            res,
            message: "The password has been changed.",
            status: 200,
        });
    };
}
exports.default = AuthServices;
