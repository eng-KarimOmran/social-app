"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Error_1 = require("../utils/Error");
const validation = (schema) => {
    return (req, res, next) => {
        const data = {
            ...req.body,
            ...req.params,
            ...req.query,
        };
        const result = schema.safeParse(data);
        if (!result.success) {
            const errors = result.error.issues.map((err) => `${err.path} => ${err.message}`);
            const message = errors.join(" | ");
            throw new Error_1.CustomError(message, 422);
        }
        next();
    };
};
exports.default = validation;
