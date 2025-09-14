"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(`${process.env.URL_DB}/social-app`);
        console.log("✅ Database contacted");
    }
    catch (error) {
        console.log("❌ Database connection failed");
    }
};
exports.connectDB = connectDB;
