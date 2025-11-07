"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const token_1 = require("../utils/token");
const Error_1 = require("../utils/Error");
const invalidToken_repo_1 = require("../modules/authModule/invalidToken.repo");
const user_repo_1 = require("../modules/authModule/user.repo");
const globalErrors_js_1 = require("../utils/globalErrors.js");
const auth = (type) => {
    return async (req, res, next) => {
        const invalidTokenModel = new invalidToken_repo_1.InvalidTokenRepo();
        const userModel = new user_repo_1.UserRepo();
        const { authorization } = req.headers;
        const BEARER_KEY = process.env.BEARER_KEY;
        if (!authorization?.startsWith(BEARER_KEY)) {
            throw new Error_1.CustomError(globalErrors_js_1.errors.invalidBearerKey.message, globalErrors_js_1.errors.invalidBearerKey.statusCode);
        }
        const token = authorization.split(" ")[1];
        const payload = (0, token_1.verifyToken)(type, token);
        const jtiInvalid = await invalidTokenModel.findOne({
            filter: {
                jti: payload.jti,
            },
        });
        if (jtiInvalid) {
            throw new Error_1.CustomError(globalErrors_js_1.errors.invalidToken.message, globalErrors_js_1.errors.invalidToken.statusCode);
        }
        const user = await userModel.findUserById(payload.userId);
        if (!user) {
            throw new Error_1.CustomError(globalErrors_js_1.errors.userNotFound.message, globalErrors_js_1.errors.userNotFound.statusCode);
        }
        const issuedAtDate = new Date(payload.iat * 1000);
        if (issuedAtDate < user.lastSensitiveUpdate) {
            throw new Error_1.CustomError(globalErrors_js_1.errors.invalidToken.message, globalErrors_js_1.errors.invalidToken.statusCode);
        }
        req.user = user;
        req.payload = payload;
        return next();
    };
};
exports.auth = auth;
