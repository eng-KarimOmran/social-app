"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Error_1 = require("../utils/Error");
const auth = (type) => {
    return async (req, res, next) => {
        const { authorization } = req.headers;
        const BEARER_KEY = process.env.BEARER_KEY;
        if (!authorization?.startsWith(BEARER_KEY)) {
            throw new Error_1.CustomError("Bearer Key is incorrect", 409);
        }
        const token = authorization.split("")[1];
        return next();
    };
};
