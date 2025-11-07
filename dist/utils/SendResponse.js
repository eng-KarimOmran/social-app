"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = ({ res, status = 200, message = "done", data = {}, }) => {
    return res.status(status).json({
        success: true,
        status,
        message,
        ...data,
    });
};
exports.default = sendResponse;
