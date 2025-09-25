"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globalErrors_1 = require("../utils/globalErrors");
const globalErrorHandler = (err, req, res, next) => {
    return res.status(err.statusCode || globalErrors_1.errors.serverError.statusCode).json({
        success: false,
        status: err.statusCode || 500,
        message: err.message || globalErrors_1.errors.serverError.message,
    });
};
exports.default = globalErrorHandler;
