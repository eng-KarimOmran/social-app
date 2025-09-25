"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transport = {
    host: process.env.HOST,
    port: Number(process.env.TRANSPORT_PORT),
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
};
exports.transporter = nodemailer_1.default.createTransport(transport);
