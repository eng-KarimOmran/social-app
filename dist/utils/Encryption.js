"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.hash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hash = async (text) => {
    const saltRounds = process.env.SALT_ROUNDS;
    const hashText = await bcrypt_1.default.hash(text, Number(saltRounds));
    return hashText;
};
exports.hash = hash;
const compare = async (text, textHash) => {
    const isMatch = await bcrypt_1.default.compare(text, textHash);
    return isMatch;
};
exports.compare = compare;
