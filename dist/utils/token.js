"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = exports.TokenType = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Error_1 = require("./Error");
const globalErrors_1 = require("./globalErrors");
var TokenType;
(function (TokenType) {
    TokenType["RefreshToken"] = "refreshToken";
    TokenType["AccessToken"] = "accessToken";
    TokenType["PasswordToken"] = "passwordToken";
})(TokenType || (exports.TokenType = TokenType = {}));
const createToken = (type, data, jwtid) => {
    let secret;
    let options = { expiresIn: "0m", jwtid };
    switch (type) {
        case TokenType.RefreshToken:
            secret = process.env.REFRESH_TOKEN_SECRET;
            options.expiresIn = "7d";
            break;
        case TokenType.AccessToken:
            secret = process.env.ACCESS_TOKEN_SECRET;
            options.expiresIn = "5m";
            break;
        case TokenType.PasswordToken:
            secret = process.env.PASSWORD_TOKEN_SECRET;
            options.expiresIn = "15m";
            break;
        default:
            throw new Error_1.CustomError(globalErrors_1.errors.invalidTokenType.message, globalErrors_1.errors.invalidTokenType.statusCode);
    }
    return jsonwebtoken_1.default.sign(data, secret, options);
};
exports.createToken = createToken;
const verifyToken = (type, token) => {
    let secret;
    switch (type) {
        case TokenType.RefreshToken:
            secret = process.env.REFRESH_TOKEN_SECRET;
            break;
        case TokenType.AccessToken:
            secret = process.env.ACCESS_TOKEN_SECRET;
            break;
        case TokenType.PasswordToken:
            secret = process.env.PASSWORD_TOKEN_SECRET;
            break;
        default:
            throw new Error_1.CustomError(globalErrors_1.errors.invalidTokenType.message, globalErrors_1.errors.invalidTokenType.statusCode);
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, secret);
        return payload;
    }
    catch (e) {
        const error = e;
        if (error.message === "jwt expired") {
            throw new Error_1.CustomError(globalErrors_1.errors.tokenExpired.message, globalErrors_1.errors.tokenExpired.statusCode);
        }
        throw new Error_1.CustomError(globalErrors_1.errors.invalidToken.message, globalErrors_1.errors.invalidToken.statusCode);
    }
};
exports.verifyToken = verifyToken;
