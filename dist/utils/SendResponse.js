"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = ({ res, status, message, data = {}, }) => {
    return res.status(status).json({
        success: true,
        status,
        message,
        ...data,
    });
};
exports.default = sendResponse;
