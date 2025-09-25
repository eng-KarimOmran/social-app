"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const generateEmailTemplate_1 = __importDefault(require("./generateEmailTemplate"));
const nodemailer_1 = require("./nodemailer");
const sendEmail = async ({ to, subject, text, name, }) => {
    const info = await nodemailer_1.transporter.sendMail({
        from: '"Social App" <pckareem2004@gmail.com>',
        to,
        subject,
        text,
        html: (0, generateEmailTemplate_1.default)({ username: name, subject, otp: text }),
    });
};
exports.sendEmail = sendEmail;
