"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globalErrorHandler = (err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        success: false,
        status: err.statusCode || 500,
        message: err.message,
    });
};
exports.default = globalErrorHandler;
